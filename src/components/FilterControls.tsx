import React from 'react';
import { Palette, RotateCcw } from 'lucide-react';

interface FilterControlsProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { id: 'none', name: 'Original' },
  { id: 'blur', name: 'Blur' },
  { id: 'brightness', name: 'Bright' },
  { id: 'contrast', name: 'Contrast' },
  { id: 'grayscale', name: 'B&W' },
  { id: 'sepia', name: 'Sepia' },
];

const FilterControls: React.FC<FilterControlsProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Palette className="w-4 h-4" />
        <span>Filters:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* 🎨 CANVAS API - Filter selection buttons */}
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              currentFilter === filter.id
                ? 'bg-zinc-100 text-zinc-900'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
            }`}
          >
            {filter.name}
          </button>
        ))}
      </div>
      
      {currentFilter !== 'none' && (
        <button
          onClick={() => onFilterChange('none')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-300 transition-colors border border-zinc-700 rounded-md hover:border-zinc-600"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};

export default FilterControls;