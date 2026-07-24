import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Clock, DollarSign, Check, Tag } from 'lucide-react';
import { Business, Service } from '../../types';

interface ServicesManagerProps {
  business: Business;
  onUpdateBusiness: (updated: Business) => Promise<void>;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({
  business,
  onUpdateBusiness,
}) => {
  const [services, setServices] = useState<Service[]>(business.services);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Service state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [price, setPrice] = useState(65);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [description, setDescription] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newSrv: Service = {
      id: `s_${Date.now()}`,
      name,
      category,
      price: Number(price),
      durationMinutes: Number(durationMinutes),
      description,
    };

    const updatedServices = [...services, newSrv];
    setServices(updatedServices);

    setIsSaving(true);
    await onUpdateBusiness({
      ...business,
      services: updatedServices,
    });
    setIsSaving(false);

    setShowAddModal(false);
    setName('');
    setDescription('');
  };

  const handleDelete = async (serviceId: string) => {
    const updated = services.filter((s) => s.id !== serviceId);
    setServices(updated);
    await onUpdateBusiness({
      ...business,
      services: updated,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Services Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Service Menu & Pricing Catalog</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage services, durations, prices, and public booking descriptions.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs flex flex-col justify-between transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                    {srv.category}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">{srv.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">${srv.price}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-end">
                    <Clock className="w-3 h-3 mr-1 text-slate-400 dark:text-slate-500" />
                    <span>{srv.durationMinutes} mins</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{srv.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                Platform Fee: ${(srv.price * 0.025).toFixed(2)}
              </span>

              <button
                onClick={() => handleDelete(srv.id)}
                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 transition-colors"
                title="Remove Service"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddService}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 text-slate-900 dark:text-slate-100 space-y-4 shadow-2xl relative transition-colors"
          >
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Add New Service</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Service Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Deluxe Scalp Treatment"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Duration (Mins)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Category Tag</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Hair, Coaching, Diagnostic"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what client receives during session..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-600 h-20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition-colors shadow-xs disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Add to Public Service Menu'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
