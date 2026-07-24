import React from 'react';
import { Scissors, GraduationCap, Wrench, HeartPulse, Camera, Grid } from 'lucide-react';
import { BusinessCategory } from '../../types';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = [
    { id: 'all', label: 'All Services', icon: Grid },
    { id: 'salon', label: 'Salons & Beauty', icon: Scissors },
    { id: 'tutor', label: 'Tutoring & Coaching', icon: GraduationCap },
    { id: 'repair', label: 'Tech & Repair', icon: Wrench },
    { id: 'clinic', label: 'Health & Wellness', icon: HeartPulse },
    { id: 'freelancer', label: 'Freelance & Creative', icon: Camera },
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-100 dark:shadow-none'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 shadow-xs'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
