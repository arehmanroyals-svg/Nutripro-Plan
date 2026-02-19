import React from 'react';
import { IngredientCategory } from '../types';
import { Leaf, Wheat, Soup, Apple, Milk, Nut, Droplets, Flame, Egg, Gauge } from 'lucide-react';

interface CategoryListProps {
  activeCategory: IngredientCategory;
  onSelectCategory: (category: IngredientCategory) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ activeCategory, onSelectCategory }) => {
  const categories = Object.values(IngredientCategory);

  const getIcon = (cat: IngredientCategory) => {
    switch (cat) {
      case IngredientCategory.VEGETABLES: return <Leaf className="w-5 h-5" />;
      case IngredientCategory.GRAINS: return <Wheat className="w-5 h-5" />;
      case IngredientCategory.DALS_LEGUMES: return <Soup className="w-5 h-5" />;
      case IngredientCategory.FRUITS: return <Apple className="w-5 h-5" />;
      case IngredientCategory.DAIRY: return <Milk className="w-5 h-5" />;
      case IngredientCategory.NUTS_SEEDS: return <Nut className="w-5 h-5" />;
      case IngredientCategory.OILS_FATS: return <Droplets className="w-5 h-5" />;
      case IngredientCategory.SPICES: return <Flame className="w-5 h-5" />;
      case IngredientCategory.PROTEINS: return <Egg className="w-5 h-5" />;
      case IngredientCategory.FERMENTED: return <Gauge className="w-5 h-5" />;
      default: return <Leaf className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex overflow-x-auto gap-2 p-2 no-scrollbar lg:flex-col lg:w-64 lg:overflow-y-auto lg:h-[calc(100vh-8rem)]">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap min-w-max lg:w-full
            ${activeCategory === cat 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'bg-white text-slate-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100'}
          `}
        >
          <span className={activeCategory === cat ? 'text-emerald-100' : 'text-emerald-600'}>
            {getIcon(cat)}
          </span>
          <span className="font-medium text-sm">{cat}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryList;