import React from 'react';
import { X } from 'lucide-react';

const FilterSidebar = ({ filters, onFilterChange, onReset, onClose }) => {
  const categories = [
    { name: 'All Categories', value: 'all' },
    { name: 'Varsity Hoodies', value: 'hoodies' },
    { name: 'Heritage Tees', value: 'tshirts' },
    { name: 'Crewneck Sweatshirts', value: 'sweatshirts' },
    { name: 'Academic Accessories', value: 'accessories' },
    { name: 'University Stationery', value: 'stationery' }
  ];

  const sizes = ['S', 'M', 'L', 'XL', 'One Size', 'Standard'];

  const handleTextChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleCategoryChange = (val) => {
    onFilterChange({ category: val });
  };

  const handleSizeChange = (size) => {
    const newVal = filters.size === size ? '' : size;
    onFilterChange({ size: newVal });
  };

  const handlePriceChange = (e, field) => {
    onFilterChange({ [field]: e.target.value });
  };

  return (
    <div className="flex flex-col gap-6 text-left p-5 md:p-0 bg-surface md:bg-transparent rounded-2xl md:rounded-none h-full">
      {/* Mobile Header Title */}
      <div className="flex justify-between items-center md:hidden border-b border-border pb-4">
        <h3 className="font-display font-bold text-lg text-text">Filters</h3>
        <button onClick={onClose} className="p-1 rounded-lg text-text-secondary hover:bg-bg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-text-secondary">
          Search
        </h4>
        <div className="relative">
          <input
            type="text"
            className="input-field pl-3.5 py-2.5 text-sm"
            placeholder="Search products..."
            value={filters.search || ''}
            onChange={handleTextChange}
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-2">
        <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-text-secondary">
          Category
        </h4>
        <div className="flex flex-col gap-2">
          {categories.map((cat, idx) => (
            <label 
              key={idx} 
              className="flex items-center gap-2.5 cursor-pointer text-sm font-sans text-text-secondary hover:text-primary font-medium py-0.5"
            >
              <input
                type="radio"
                name="category"
                checked={filters.category === cat.value}
                onChange={() => handleCategoryChange(cat.value)}
                className="w-4 h-4 accent-primary focus:ring-primary border-border rounded"
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes Toggle */}
      <div className="space-y-2">
        <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-text-secondary">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size, idx) => {
            const isSelected = filters.size === size;
            return (
              <button
                key={idx}
                onClick={() => handleSizeChange(size)}
                className={`px-3.5 py-2 border rounded-xl font-sans text-xs font-semibold tracking-wider transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary border-primary text-white shadow-md' 
                    : 'bg-surface border-border text-text hover:border-primary hover:text-primary'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3">
        <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-text-secondary">
          Price Range
        </h4>
        <div className="flex gap-3 items-center">
          <div className="relative flex-grow">
            <span className="absolute left-3 top-2.5 text-xs text-text-secondary font-bold">₹</span>
            <input
              type="number"
              className="w-full pl-6 pr-2 py-2 border border-border bg-surface rounded-xl text-sm font-sans text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceChange(e, 'minPrice')}
            />
          </div>
          <span className="text-text-secondary font-medium font-sans">-</span>
          <div className="relative flex-grow">
            <span className="absolute left-3 top-2.5 text-xs text-text-secondary font-bold">₹</span>
            <input
              type="number"
              className="w-full pl-6 pr-2 py-2 border border-border bg-surface rounded-xl text-sm font-sans text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange(e, 'maxPrice')}
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button 
        onClick={onReset}
        className="w-full py-3 border border-primary text-primary hover:bg-primary/5 font-semibold text-sm rounded-xl transition-all duration-200 mt-2"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
