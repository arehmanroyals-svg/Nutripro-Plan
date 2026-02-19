
import React, { useState } from 'react';
import { MealStats, AIAnalysisResult, SelectedIngredient, Ingredient, UserGoal } from '../types';
import { analyzeMealPlan } from '../services/apiService';
import { Sparkles, Loader2, ChevronUp, ChevronDown, Activity, Zap, Utensils, Trash2, ListChecks, ArrowRight, CheckCircle2, FastForward, Target } from 'lucide-react';

interface NutritionPanelProps {
  stats: MealStats;
  selectedCount: number;
  ingredients: SelectedIngredient[];
  targetCalories: number;
  setTargetCalories: (calories: number) => void;
  onUpdate: (ingredient: Ingredient, count: number) => void;
  onClearAll: () => void;
  goal: UserGoal;
}

const NutritionPanel: React.FC<NutritionPanelProps> = ({ 
  stats, 
  selectedCount, 
  ingredients, 
  targetCalories,
  setTargetCalories,
  onClearAll,
  goal
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'recipe' | 'synergy'>('analysis');

  const handleAnalyze = async () => {
    if (selectedCount === 0) return;
    setIsLoading(true);
    try {
      const result = await analyzeMealPlan(ingredients, stats, targetCalories, goal);
      setAnalysis(result);
      if (!isExpanded) setIsExpanded(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const calPercentage = Math.min(100, (stats.totalCalories / targetCalories) * 100);

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-15px_40px_rgba(0,0,0,0.15)] z-50 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isExpanded ? 'h-[92vh] rounded-t-[3rem]' : 'h-32 lg:h-36'}`}>
      <div className="absolute top-0 left-0 right-0 h-8 flex justify-center items-center cursor-pointer hover:bg-slate-50 rounded-t-[3rem] transition-colors" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="w-16 h-1 bg-slate-200 rounded-full" />
      </div>

      <div className="container mx-auto px-6 h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 min-h-[7rem]">
          <div className="flex-1">
            <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer group flex items-center gap-3 mb-1">
               <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Your Plate {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-300" /> : <ChevronUp className="w-5 h-5 text-slate-300" />}
              </h2>
              <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">{goal.replace('_', ' ')}</div>
            </div>
            
            <div className="flex items-center gap-4 lg:gap-8">
               <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{stats.totalCalories.toFixed(0)}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">/ {targetCalories} kcal</span>
                  </div>
                  <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${calPercentage > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${calPercentage}%` }} 
                    />
                  </div>
               </div>
               <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>
               <div className="flex flex-col">
                  <div className="text-xs font-black text-blue-600">{stats.totalProtein.toFixed(1)}g</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protein</div>
               </div>
               <div className="flex flex-col">
                  <div className="text-xs font-black text-amber-600">{stats.totalFibre.toFixed(1)}g</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Fiber</div>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={onClearAll}
              className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-slate-100"
              title="Clear all ingredients"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={handleAnalyze} 
              disabled={selectedCount === 0 || isLoading} 
              className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] font-black transition-all shadow-xl hover:scale-105 active:scale-95 ${selectedCount === 0 ? 'bg-slate-100 text-slate-300' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-orange-400" />}
              {isLoading ? 'ANALYZING...' : 'AI ADVISOR'}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="flex-1 overflow-y-auto pb-24 space-y-8 no-scrollbar pt-4">
            {/* Target Settings Section */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" /> Adjust Meal Target
                </h3>
                <p className="text-sm text-slate-500 font-medium">Set your desired calorie intake for this specific plate.</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="200" 
                    max="1500" 
                    step="50" 
                    value={targetCalories} 
                    onChange={(e) => setTargetCalories(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 font-black text-slate-900 min-w-[100px] text-center">
                    {targetCalories} <span className="text-[10px] text-slate-400">KCAL</span>
                  </div>
                </div>
                <div className="flex justify-between px-1">
                  <button onClick={() => setTargetCalories(400)} className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-tighter">Light (400)</button>
                  <button onClick={() => setTargetCalories(600)} className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-tighter">Balance (600)</button>
                  <button onClick={() => setTargetCalories(900)} className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-tighter">Power (900)</button>
                </div>
              </div>
            </div>

            {analysis ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-slate-50 p-1 rounded-2xl flex border border-slate-100">
                    {(['analysis', 'recipe', 'synergy'] as const).map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'analysis' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-black text-slate-900">{analysis.recipeSuggestion}</h3>
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-[9px] font-black uppercase tracking-tighter">
                            <Zap className="w-3 h-3" /> Groq Engine 3.3
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-medium mb-6">{analysis.healthNote}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="bg-emerald-50 p-6 rounded-3xl">
                              <h4 className="font-black text-emerald-900 text-sm mb-2 flex items-center gap-2 uppercase tracking-widest"><Zap className="w-4 h-4" /> Goal Impact</h4>
                              <p className="text-emerald-700 text-sm font-bold leading-relaxed">{analysis.weightLossSuggestion}</p>
                           </div>
                           <div className="bg-purple-50 p-6 rounded-3xl">
                              <h4 className="font-black text-purple-900 text-sm mb-2 flex items-center gap-2 uppercase tracking-widest"><Sparkles className="w-4 h-4" /> Synergy Note</h4>
                              <p className="text-purple-700 text-sm font-bold leading-relaxed">{analysis.synergyNotes}</p>
                           </div>
                        </div>
                      </div>

                      {analysis.smartSwaps.length > 0 && (
                        <div>
                          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Metabolic Smart Swaps</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {analysis.smartSwaps.map((swap, idx) => (
                              <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-rose-500"><Trash2 className="w-5 h-5" /></div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 text-xs font-black text-slate-900 mb-1">
                                    <span className="line-through opacity-40">{swap.remove}</span>
                                    <ArrowRight className="w-3 h-3 text-emerald-500" />
                                    <span className="text-emerald-600">{swap.add}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-medium">{swap.reason}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'recipe' && (
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
                      <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <Utensils className="w-7 h-7 text-orange-500" /> Chef's Instructions
                      </h3>
                      <div className="space-y-6">
                        {analysis.cookingSteps.map((step, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-black text-slate-500 text-sm">{idx + 1}</div>
                            <p className="text-slate-700 font-medium leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'synergy' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-500" /> Absorption Score</h4>
                        <div className="text-5xl font-black text-emerald-600 mb-2">{stats.avgBioavailability.toFixed(0)}%</div>
                        <p className="text-sm text-slate-500 font-medium">Protein Utilization Efficiency</p>
                      </div>
                      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2"><ListChecks className="w-5 h-5 text-blue-500" /> Metabolic Load</h4>
                        <div className="text-5xl font-black text-blue-600 mb-2">{stats.avgGI.toFixed(0)}</div>
                        <p className="text-sm text-slate-500 font-medium">Average Glycemic Index</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-black text-xs uppercase tracking-widest opacity-50">Dish Components</h4>
                      <button onClick={onClearAll} className="text-[10px] font-black uppercase text-rose-400 hover:text-rose-300">Clear All</button>
                    </div>
                    <div className="space-y-3">
                      {ingredients.map(ing => (
                        <div key={ing.id} className="flex items-center justify-between text-sm font-bold">
                          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {ing.name}</span>
                          <span className="opacity-50">{ing.count}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Ready for Analysis</h3>
                <p className="text-sm text-slate-400 max-w-xs font-medium">Click "AI Advisor" to get metabolic insights and personalized cooking instructions.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionPanel;
