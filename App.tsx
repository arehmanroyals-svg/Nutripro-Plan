
import React, { useState, useMemo } from 'react';
import { INGREDIENTS } from './constants';
import { Ingredient, SelectedIngredient, IngredientCategory, MealStats, AISearchResult, UserGoal } from './types';
import CategoryList from './components/CategoryList';
import IngredientGrid from './components/IngredientGrid';
import NutritionPanel from './components/NutritionPanel';
import AIResponseModal from './components/AIResponseModal';
import { ChefHat, Target, Sparkles, Activity } from 'lucide-react';
import { processSearchQuery } from './services/apiService';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>(IngredientCategory.VEGETABLES);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [customIngredients, setCustomIngredients] = useState<Ingredient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [targetCalories, setTargetCalories] = useState(600);
  const [goal, setGoal] = useState<UserGoal>('MAINTENANCE');
  
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSearchError, setAiSearchError] = useState<string | null>(null);
  
  const [qaModal, setQaModal] = useState<{ isOpen: boolean; title: string; content: string }>({
    isOpen: false, title: '', content: ''
  });

  const handleCategorySelect = (category: IngredientCategory) => {
    setActiveCategory(category);
    setSearchQuery("");
    setAiSearchError(null);
  };

  const allIngredients = useMemo(() => [...INGREDIENTS, ...customIngredients], [customIngredients]);

  const displayedIngredients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length > 0) {
      return allIngredients.filter(i => 
        (i.name || "").toLowerCase().includes(q)
      );
    }
    return allIngredients.filter(i => i.category === activeCategory);
  }, [allIngredients, activeCategory, searchQuery]);

  const handleIngredientChange = (ingredient: Ingredient, newCount: number) => {
    setSelectedIngredients(prev => {
      if (newCount <= 0) return prev.filter(i => i.id !== ingredient.id);
      const existing = prev.find(i => i.id === ingredient.id);
      if (existing) return prev.map(i => i.id === ingredient.id ? { ...i, count: newCount } : i);
      return [...prev, { ...ingredient, count: newCount }];
    });
  };

  const sanitizeAIData = (data: Ingredient): Ingredient => {
    // Prevent impossible nutritional values (Energy density of pure fat is 9kcal/g)
    const maxCals = (data.weightInGrams || 100) * 9;
    return {
      ...data,
      calories: Math.min(data.calories, maxCals),
      protein: Math.min(data.protein, data.weightInGrams),
      carbs: Math.min(data.carbs, data.weightInGrams),
      fibre: Math.min(data.fibre, data.weightInGrams),
      giIndex: Math.min(Math.max(data.giIndex || 0, 0), 100),
      bioavailability: Math.min(Math.max(data.bioavailability || 70, 0), 100)
    };
  };

  const handleAISearch = async () => {
    if (!searchQuery) return;
    setIsSearchingAI(true);
    setAiSearchError(null);
    try {
      const availableNames = allIngredients.map(i => i.name || "Unknown");
      const result = await processSearchQuery(searchQuery, availableNames);
      if (!result) return;

      if (result.intent === 'FIND_INGREDIENT' && result.ingredientData) {
        if (result.ingredientData.name) {
          const cleanData = sanitizeAIData(result.ingredientData);
          setCustomIngredients(prev => [...prev, cleanData]);
          handleIngredientChange(cleanData, 1);
          if (cleanData.category) {
            setActiveCategory(cleanData.category);
          }
        }
      } else if (result.intent === 'GENERAL_QA' && result.qaAnswer) {
        setQaModal({ isOpen: true, title: 'Expert Advice', content: result.qaAnswer });
      } else if (result.intent === 'MEAL_SETUP' && result.mealSetup) {
        const recommended = result.mealSetup.ingredients || [];
        recommended.forEach(name => {
          if (!name) return;
          const match = allIngredients.find(i => 
            (i.name || "").toLowerCase().includes(name.toLowerCase())
          );
          if (match) handleIngredientChange(match, 1);
        });
        setQaModal({ isOpen: true, title: 'Smart Setup', content: result.mealSetup.reasoning || "Balanced meal plan generated." });
      }
      setSearchQuery("");
    } catch (e) {
      setAiSearchError("Search engine unavailable.");
    } finally {
      setIsSearchingAI(false);
    }
  };

  const mealStats: MealStats = useMemo(() => {
    if (selectedIngredients.length === 0) return { totalProtein: 0, totalCarbs: 0, totalFibre: 0, totalCalories: 0, avgBioavailability: 0, avgGI: 0 };
    const totals = selectedIngredients.reduce((acc, curr) => {
      acc.totalProtein += (curr.protein || 0) * (curr.count || 0);
      acc.totalCarbs += (curr.carbs || 0) * (curr.count || 0);
      acc.totalFibre += (curr.fibre || 0) * (curr.count || 0);
      acc.totalCalories += (curr.calories || 0) * (curr.count || 0);
      return acc;
    }, { totalProtein: 0, totalCarbs: 0, totalFibre: 0, totalCalories: 0 });

    const totalWeight = selectedIngredients.reduce((sum, i) => sum + ((i.weightInGrams || 100) * (i.count || 0)), 0);
    const avgGI = totalWeight > 0 ? selectedIngredients.reduce((sum, i) => sum + ((i.giIndex || 0) * ((i.weightInGrams || 100) * (i.count || 0))), 0) / totalWeight : 0;
    const totalCount = selectedIngredients.reduce((sum, i) => sum + (i.count || 0), 0);
    const avgBio = totalCount > 0 ? selectedIngredients.reduce((sum, i) => sum + ((i.bioavailability || 0) * (i.count || 0)), 0) / totalCount : 0;

    return { ...totals, avgBioavailability: avgBio, avgGI };
  }, [selectedIngredients]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-lg shadow-emerald-200"><ChefHat className="w-6 h-6 text-white" /></div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">NutriPlan <span className="text-emerald-600">Pro</span></h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Metabolic Intelligence Engine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
             {(['WEIGHT_LOSS', 'MUSCLE_GAIN', 'MAINTENANCE', 'DIABETIC_FRIENDLY'] as UserGoal[]).map(g => (
               <button 
                 key={g}
                 onClick={() => setGoal(g)}
                 className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${goal === g ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {g.replace('_', ' ')}
               </button>
             ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
        <nav className="w-full lg:w-72 border-r border-slate-200 bg-white/50 py-6">
          <CategoryList activeCategory={activeCategory} onSelectCategory={handleCategorySelect} />
        </nav>
        
        <section className="flex-1 overflow-y-auto p-4 lg:p-10 no-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-1">{searchQuery ? 'Discovering...' : activeCategory}</h2>
                  <p className="text-slate-400 font-medium">Add ingredients to calculate real-time metabolic impact.</p>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-xs border border-emerald-100">
                  <Activity className="w-4 h-4" />
                  Target: {goal.replace('_', ' ')}
               </div>
            </div>

            <IngredientGrid 
              ingredients={displayedIngredients} 
              selectedIngredients={selectedIngredients} 
              onUpdate={handleIngredientChange} 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery} 
              onAISearch={handleAISearch} 
              isSearchingAI={isSearchingAI} 
              aiError={aiSearchError} 
            />
          </div>
        </section>
      </main>

      <NutritionPanel 
        stats={mealStats} 
        ingredients={selectedIngredients} 
        selectedCount={selectedIngredients.reduce((acc, i) => acc + (i.count || 0), 0)} 
        targetCalories={targetCalories} 
        setTargetCalories={setTargetCalories} 
        onUpdate={handleIngredientChange}
        onClearAll={() => setSelectedIngredients([])}
        goal={goal}
      />
      
      <AIResponseModal 
        isOpen={qaModal.isOpen} 
        onClose={() => setQaModal({...qaModal, isOpen: false})} 
        title={qaModal.title} 
        content={qaModal.content} 
      />
    </div>
  );
};

export default App;
