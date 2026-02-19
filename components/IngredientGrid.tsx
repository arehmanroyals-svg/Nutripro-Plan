import React, { useState, useEffect } from 'react';
import { Ingredient, SelectedIngredient } from '../types';
import { Plus, Minus, Search, X, Sparkles, Loader2, Scale, Zap, ShieldCheck } from 'lucide-react';

interface IngredientGridProps {
  ingredients: Ingredient[];
  selectedIngredients: SelectedIngredient[];
  onUpdate: (ingredient: Ingredient, count: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAISearch?: () => void;
  isSearchingAI?: boolean;
  aiError?: string | null;
}

const IngredientCard: React.FC<{
  item: Ingredient;
  count: number;
  onUpdate: (item: Ingredient, count: number) => void;
  isCustom: boolean;
}> = ({ item, count, onUpdate, isCustom }) => {
  const [mode, setMode] = useState<'unit' | 'gram'>('unit');
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (mode === 'gram') {
       const grams = Math.round(count * item.weightInGrams);
       setInputValue(grams > 0 ? grams.toString() : "");
    }
  }, [count, mode, item.weightInGrams]);

  const toggleMode = () => {
    setMode(prev => prev === 'unit' ? 'gram' : 'unit');
  };

  const handleGramChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    const grams = parseFloat(val);
    if (!isNaN(grams)) {
      const newCount = grams / item.weightInGrams;
      onUpdate(item, newCount);
    } else if (val === "") {
      onUpdate(item, 0);
    }
  };

  const normFactor = 100 / (item.weightInGrams || 100);
  const p100 = item.protein * normFactor;
  const f100 = item.fibre * normFactor;

  const displayCount = count > 0 ? count : 1;
  const totals = {
    cal: Math.round(item.calories * displayCount),
    pro: (item.protein * displayCount).toFixed(1),
    fib: (item.fibre * displayCount).toFixed(1),
    carb: (item.carbs * displayCount).toFixed(1),
  };

  const proRatio = Math.min(100, (p100 / 20) * 100);
  const fibRatio = Math.min(100, (f100 / 10) * 100);

  const giColor = item.giIndex <= 55 ? 'text-emerald-500' : item.giIndex <= 69 ? 'text-orange-500' : 'text-rose-500';
  const giLabel = item.giIndex <= 55 ? 'Low GI' : item.giIndex <= 69 ? 'Med GI' : 'High GI';

  return (
    <div 
      className={`
        relative p-5 rounded-[2rem] border transition-all duration-300 flex flex-col h-full group
        ${count > 0 
          ? 'border-emerald-500 bg-emerald-50/30 shadow-[0_10px_30px_rgba(16,185,129,0.1)] ring-1 ring-emerald-500/20' 
          : 'border-slate-100 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1'}
      `}
    >
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
           {isCustom && (
             <span className="flex items-center gap-1 text-[10px] font-black text-white bg-emerald-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">
               <Sparkles className="w-2.5 h-2.5" /> Discovery
             </span>
           )}
           {p100 > 15 && (
             <span className="flex items-center gap-1 text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-tighter">
               <Zap className="w-2.5 h-2.5" /> High Protein
             </span>
           )}
           {item.giIndex > 0 && (
             <span className={`flex items-center gap-1 text-[10px] font-black ${giColor} bg-white border border-current px-2 py-0.5 rounded-full uppercase tracking-tighter`}>
               <ShieldCheck className="w-2.5 h-2.5" /> {giLabel}: {item.giIndex}
             </span>
           )}
        </div>
        
        <div className="flex justify-between items-start pr-2">
          <h3 className="font-black text-slate-800 text-xl leading-none group-hover:text-emerald-700 transition-colors">{item.name}</h3>
          <button 
            onClick={toggleMode}
            className="p-2 bg-slate-50 hover:bg-emerald-100 rounded-xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
          {mode === 'unit' ? `${item.unit} • ${item.weightInGrams}g` : 'Custom Gram Input'}
        </p>
      </div>

      <div className="space-y-3 mb-6 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
         <div>
            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
               <span>Protein</span>
               <span className="text-blue-600">{totals.pro}g</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
               <div style={{ width: `${proRatio}%` }} className="h-full bg-blue-500 transition-all duration-700"></div>
            </div>
         </div>
         <div>
            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
               <span>Dietary Fiber</span>
               <span className="text-emerald-600">{totals.fib}g</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
               <div style={{ width: `${fibRatio}%` }} className="h-full bg-emerald-500 transition-all duration-700"></div>
            </div>
         </div>
         <div className="flex justify-between items-baseline pt-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Energy</span>
            <span className="text-sm font-black text-slate-900">{totals.cal} <span className="text-[10px] opacity-40">kcal</span></span>
         </div>
      </div>

      <div className="mt-auto pt-2 flex items-center justify-between">
         <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            {mode === 'unit' ? (
              <>
                 <button onClick={() => onUpdate(item, Math.max(0, count - 1))} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all">
                    <Minus className="w-5 h-5" />
                 </button>
                 <div className="w-10 text-center font-black text-lg text-slate-800">{count}</div>
                 <button onClick={() => onUpdate(item, count + 1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-black transition-all">
                    <Plus className="w-5 h-5" />
                 </button>
              </>
            ) : (
              <div className="flex items-center px-3 gap-2">
                 <input type="number" value={inputValue} onChange={handleGramChange} placeholder="0" className="w-20 py-2 text-center bg-transparent font-black text-slate-800 focus:outline-none" />
                 <span className="text-xs font-black text-slate-400 uppercase">g</span>
              </div>
            )}
         </div>

         <div className="flex flex-col items-end">
            <div className="relative w-10 h-10">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                 <circle 
                   cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" 
                   strokeDasharray={100} strokeDashoffset={100 - item.bioavailability}
                   strokeLinecap="round" className="text-purple-500"
                 />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-purple-600">
                 {item.bioavailability}%
               </div>
            </div>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">Absorb</span>
         </div>
      </div>
    </div>
  );
};

const IngredientGrid: React.FC<IngredientGridProps> = ({ 
  ingredients, 
  selectedIngredients, 
  onUpdate,
  searchQuery,
  onSearchChange,
  onAISearch,
  isSearchingAI = false,
  aiError
}) => {
  const getCount = (id: string) => selectedIngredients.find(i => i.id === id)?.count || 0;

  return (
    <div className="flex flex-col gap-6 pb-48 lg:pb-8">
      <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-md py-4">
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors z-10">
            <Search className="w-full h-full" />
          </div>
          <input 
            type="text" 
            placeholder="Search ingredients or ask questions..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
               if (e.key === 'Enter' && searchQuery && onAISearch) onAISearch();
            }}
            className="w-full pl-12 pr-12 py-4 rounded-[2rem] border-2 border-slate-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all bg-white shadow-xl shadow-slate-200/50 text-slate-900 placeholder:text-slate-400 font-bold"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full text-slate-400 z-10">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ingredients.length === 0 && !isSearchingAI ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400 bg-white rounded-[3rem] border border-dashed border-slate-200">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-slate-200" />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-1">Zero Results Found</h3>
             <p className="text-sm font-medium text-slate-400 mb-8 max-w-xs text-center">Ask our expert for nutrition facts or recipe ideas.</p>
             {searchQuery && onAISearch && (
               <button onClick={onAISearch} className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black transition-all shadow-2xl hover:scale-105 active:scale-95 group">
                 <Sparkles className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                 ASK NUTRITION EXPERT
               </button>
             )}
          </div>
        ) : isSearchingAI ? (
           <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-slate-100 animate-pulse">
             <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-1">Analyzing Nutrition Data</h3>
             <p className="text-sm font-medium text-slate-400">Fetching fingerprints for "{searchQuery}"</p>
           </div>
        ) : (
          ingredients.map((item) => (
            <IngredientCard key={item.id} item={item} count={getCount(item.id)} onUpdate={onUpdate} isCustom={item.id.startsWith('custom-')} />
          ))
        )}
      </div>
      {ingredients.length > 0 && searchQuery && onAISearch && (
        <div className="flex justify-center mt-8">
           <button onClick={onAISearch} className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] font-black transition-all shadow-2xl hover:scale-105 active:scale-95 group">
             <Sparkles className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
             ASK NUTRITION EXPERT
           </button>
        </div>
      )}
    </div>
  );
};

export default IngredientGrid;