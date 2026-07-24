import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_BUSINESSES, INITIAL_BOOKINGS, INITIAL_CLIENTS, INITIAL_REVIEWS, INITIAL_MESSAGES } from './src/data/mockData.js';
import { Business, Booking, ClientRecord, Review, ChatMessage } from './src/types.js';

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-Memory Database
let businesses: Business[] = [...INITIAL_BUSINESSES];
let bookings: Booking[] = [...INITIAL_BOOKINGS];
let clients: ClientRecord[] = [...INITIAL_CLIENTS];
let reviews: Review[] = [...INITIAL_REVIEWS];
let messages: ChatMessage[] = [...INITIAL_MESSAGES];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- REST API ENDPOINTS ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Businesses API
  app.get('/api/businesses', (req, res) => {
    const category = req.query.category as string;
    if (category && category !== 'all') {
      const filtered = businesses.filter((b) => b.category === category);
      return res.json(filtered);
    }
    res.json(businesses);
  });

  app.get('/api/businesses/:id', (req, res) => {
    const biz = businesses.find((b) => b.id === req.params.id);
    if (!biz) return res.status(404).json({ error: 'Business not found' });
    res.json(biz);
  });

  app.put('/api/businesses/:id', (req, res) => {
    const index = businesses.findIndex((b) => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Business not found' });
    businesses[index] = { ...businesses[index], ...req.body };
    res.json(businesses[index]);
  });

  // Bookings API
  app.get('/api/bookings', (req, res) => {
    const bizId = req.query.businessId as string;
    if (bizId) {
      return res.json(bookings.filter((b) => b.businessId === bizId));
    }
    res.json(bookings);
  });

  app.post('/api/bookings', (req, res) => {
    const { businessId, serviceId, serviceName, servicePrice, staffId, staffName, customerName, customerEmail, customerPhone, date, time, notes } = req.body;
    
    const biz = businesses.find((b) => b.id === businessId);
    if (!biz) return res.status(400).json({ error: 'Invalid business ID' });

    // Calculate platform fee (2.5% of booking price, min $0.50)
    const platformFee = Math.max(0.5, Number((servicePrice * 0.025).toFixed(2)));
    
    // Auto-confirm logic if enabled and price is under autoConfirmLimit
    const isAutoConfirm = biz.autoReplyEnabled && servicePrice <= (biz.autoConfirmLimit || 200);

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      businessId,
      businessName: biz.name,
      serviceId,
      serviceName,
      servicePrice,
      staffId: staffId || biz.staff[0]?.id,
      staffName: staffName || biz.staff[0]?.name,
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      status: isAutoConfirm ? 'confirmed' : 'pending',
      paymentStatus: 'paid',
      platformFee,
      notes: notes || '',
      reminderSentSms: false,
      reminderSentWhatsapp: false,
      createdAt: new Date().toISOString().split('T')[0]
    };

    bookings.unshift(newBooking);

    // Update or add client record
    let existingClient = clients.find((c) => c.email.toLowerCase() === customerEmail.toLowerCase());
    if (existingClient) {
      existingClient.totalVisits += 1;
      existingClient.totalSpent += servicePrice;
      existingClient.lastVisitDate = date;
    } else {
      clients.push({
        id: `cli_${Date.now()}`,
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        totalVisits: 1,
        totalSpent: servicePrice,
        lastVisitDate: date,
        preferredService: serviceName,
        tags: ['New Client']
      });
    }

    res.status(201).json(newBooking);
  });

  app.put('/api/bookings/:id', (req, res) => {
    const index = bookings.findIndex((b) => b.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Booking not found' });
    bookings[index] = { ...bookings[index], ...req.body };
    res.json(bookings[index]);
  });

  // Clients API
  app.get('/api/clients', (req, res) => {
    res.json(clients);
  });

  // Reviews API
  app.get('/api/reviews', (req, res) => {
    const bizId = req.query.businessId as string;
    if (bizId) {
      return res.json(reviews.filter((r) => r.businessId === bizId));
    }
    res.json(reviews);
  });

  app.post('/api/reviews', (req, res) => {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      aiSentiment: 'positive',
      ...req.body
    };
    reviews.unshift(newReview);
    res.status(201).json(newReview);
  });

  // Messages API
  app.get('/api/messages', (req, res) => {
    const bizId = req.query.businessId as string;
    if (bizId) {
      return res.json(messages.filter((m) => m.businessId === bizId));
    }
    res.json(messages);
  });

  app.post('/api/messages', (req, res) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...req.body
    };
    messages.push(newMsg);
    res.status(201).json(newMsg);
  });

  // --- GEMINI SERVER-SIDE AI ROUTES ---

  // 1. AI Customer Chat Auto-Reply
  app.post('/api/ai/chat-reply', async (req, res) => {
    try {
      const { businessId, customerMessage, customerName } = req.body;
      const biz = businesses.find((b) => b.id === businessId) || businesses[0];

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          reply: `Hello ${customerName || 'there'}! Thanks for reaching out to ${biz.name}. We received your message: "${customerMessage}". Our staff will confirm your request shortly!`,
          source: 'fallback'
        });
      }

      const servicesSummary = biz.services.map((s) => `- ${s.name}: $${s.price} (${s.durationMinutes} mins)`).join('\n');
      const staffSummary = biz.staff.map((st) => `- ${st.name} (${st.role})`).join('\n');

      const systemPrompt = `You are the friendly, professional AI virtual receptionist for "${biz.name}".
Business Details:
- Category: ${biz.categoryLabel}
- Hours: ${biz.openingHours}
- Phone: ${biz.phone}
- Address: ${biz.address}
- Tone of Voice: ${biz.aiTone}
- Services Available:
${servicesSummary}
- Team Members:
${staffSummary}

Instructions:
1. Respond directly, politely, and naturally to the customer's question.
2. If they ask about prices or services, summarize accurately from the list above.
3. If they ask about booking, invite them to pick a date/time or suggest an available slot during working hours.
4. Keep the message under 3 sentences, concise, warm, and clear.
5. End with an encouraging closing statement or question.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Customer ${customerName || 'Client'} says: "${customerMessage}"`,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7
        }
      });

      const replyText = response.text?.trim() || `Thanks for contacting ${biz.name}! How else can we assist you today?`;

      res.json({ reply: replyText, source: 'gemini' });
    } catch (err: any) {
      console.error('Gemini Chat Error:', err);
      res.status(500).json({ error: 'Failed to generate AI auto-reply', details: err.message });
    }
  });

  // 2. AI Personalized Re-Engagement Follow-Up Generator
  app.post('/api/ai/generate-followup', async (req, res) => {
    try {
      const { businessId, clientName, preferredService, lastVisitDate, totalVisits, customIncentive } = req.body;
      const biz = businesses.find((b) => b.id === businessId) || businesses[0];

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          sms: `Hi ${clientName}! It's been a while since your last visit to ${biz.name}. Book your next ${preferredService || 'service'} this week and get 10% off! Book online: app.autobook.com/${biz.id}`,
          whatsapp: `Hey ${clientName} 👋, we miss seeing you at ${biz.name}! It's time for your next ${preferredService || 'appointment'}. Use code WELCOMEBACK for a special discount!`,
          source: 'fallback'
        });
      }

      const prompt = `Draft two quick, engaging re-engagement messages (1 for SMS max 160 chars, 1 for WhatsApp with emojis) for a local business follow-up app.
Business: "${biz.name}" (${biz.categoryLabel})
Client Name: ${clientName}
Last Visit: ${lastVisitDate} (it has been several weeks/months)
Preferred Service: ${preferredService || 'Service'}
Total Past Visits: ${totalVisits}
Special Offer/Incentive to include: ${customIncentive || '10% off your next booking'}

Format the output strictly as valid JSON with keys "sms" and "whatsapp".
Example:
{
  "sms": "Hi Sarah, we miss you at Glow Hair! Book your next Balayage today & get 10% off: autobook.app/g12",
  "whatsapp": "Hey Sarah! 👋 It's been 6 weeks since your last visit to Glow & Co. Ready for a touchup? Click to book with 10% off! ✨"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });

      let jsonResult;
      try {
        jsonResult = JSON.parse(response.text || '{}');
      } catch {
        jsonResult = {
          sms: `Hi ${clientName}, time for your next ${preferredService} at ${biz.name}! Get 10% off today: autobook.app/${biz.id}`,
          whatsapp: `Hey ${clientName}! 👋 We'd love to see you again at ${biz.name}. Enjoy ${customIncentive || '10% off'} on your next booking!`
        };
      }

      res.json(jsonResult);
    } catch (err: any) {
      console.error('Gemini Followup Error:', err);
      res.status(500).json({ error: 'Failed to generate follow-up message', details: err.message });
    }
  });

  // 3. AI Business Advisor & Growth Recommendations
  app.post('/api/ai/business-insights', async (req, res) => {
    try {
      const { businessId } = req.body;
      const biz = businesses.find((b) => b.id === businessId) || businesses[0];
      const bizBookings = bookings.filter((b) => b.businessId === biz.id);

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          insights: [
            {
              title: 'Optimize Off-Peak Afternoon Hours',
              category: 'pricing',
              description: 'Tuesday & Thursday 2 PM - 4 PM show 40% lower booking density than weekends.',
              impact: '+$320/week revenue potential',
              actionable: 'Launch a 15% Off "Mid-Week Refresher" promotion targeting existing clients.'
            },
            {
              title: 'Automate WhatsApp Appointment Reminders',
              category: 'efficiency',
              description: 'Sending 24-hour advance WhatsApp reminders reduces no-shows from 12% to under 2%.',
              impact: 'Save 3+ hours/week manual texting',
              actionable: 'Enable automatic WhatsApp dispatch in AutoBook settings.'
            },
            {
              title: 'Re-Engage Lapsed VIP Clients',
              category: 'retention',
              description: '3 clients who spent >$300 have not booked in the last 45 days.',
              impact: 'Recover $450 in recurring bookings',
              actionable: 'Use 1-Click AI Follow-up in your Client CRM to send personalized perks.'
            }
          ]
        });
      }

      const prompt = `Analyze this local business and provide 3 actionable, smart AI business growth insights:
Business Name: "${biz.name}"
Category: ${biz.categoryLabel}
Total Recorded Bookings: ${bizBookings.length}
Services offered: ${biz.services.map((s) => `${s.name} ($${s.price})`).join(', ')}

Return a JSON array of 3 objects under key "insights". Each object must contain:
- title: Short title (4-7 words)
- category: one of "pricing", "marketing", "retention", "efficiency"
- description: Concise analysis (15-25 words)
- impact: Estimated ROI impact (e.g. "+$400/month", "Save 4 hrs/wk")
- actionable: One clear step the owner can take right now.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });

      let parsed;
      try {
        parsed = JSON.parse(response.text || '{}');
      } catch {
        parsed = { insights: [] };
      }

      res.json(parsed);
    } catch (err: any) {
      console.error('Gemini Insights Error:', err);
      res.status(500).json({ error: 'Failed to generate AI insights', details: err.message });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AutoBook Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
