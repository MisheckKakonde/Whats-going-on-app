import React from 'react';
import { Category } from '../types';
import { Music, Utensils, Palette, Users, Trophy, Moon, Hammer, Flame } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Vibe', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'music', label: 'Live Music', icon: <Music className="w-3.5 h-3.5" /> },
    { id: 'food', label: 'Food & Drink', icon: <Utensils className="w-3.5 h-3.5" /> },
    { id: 'arts', label: 'Arts & Culture', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'nightlife', label: 'Nightlife', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'sports', label: 'Outdoors & Active', icon: <Trophy className="w-3.5 h-3.5" /> },
    { id: 'workshops', label: 'Workshops', icon: <Hammer className="w-3.5 h-3.5" /> },
    { id: 'community', label: 'Community', icon: <Users className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white px-3 py-2 border-b border-zinc-100 overflow-x-auto no-scrollbar flex items-center gap-1.5">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            id={`category-btn-${cat.id}`}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              isSelected
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                : 'bg-zinc-100 text-zinc-700 border-transparent hover:bg-zinc-200'
            }`}
          >
            <span className={isSelected ? 'text-amber-300' : 'text-zinc-500'}>
              {cat.icon}
            </span>
            <span className="whitespace-nowrap">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
