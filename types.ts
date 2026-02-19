
export enum IngredientCategory {
  VEGETABLES = 'Vegetables',
  GRAINS = 'Grains',
  DALS_LEGUMES = 'Dals/Legumes',
  FRUITS = 'Fruits',
  DAIRY = 'Dairy',
  NUTS_SEEDS = 'Nuts & Seeds',
  OILS_FATS = 'Oils & Fats',
  SPICES = 'Spices',
  PROTEINS = 'Proteins (Egg/Meat/Plant)',
  FERMENTED = 'Fermented Foods'
}

export type UserGoal = 'WEIGHT_LOSS' | 'MUSCLE_GAIN' | 'MAINTENANCE' | 'DIABETIC_FRIENDLY';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  protein: number;
  carbs: number;
  fibre: number;
  bioavailability: number;
  calories: number;
  unit: string;
  weightInGrams: number;
  giIndex: number;
  vitamins: string[];
  minerals: string[];
}

export interface SelectedIngredient extends Ingredient {
  count: number;
}

export interface MealStats {
  totalProtein: number;
  totalCarbs: number;
  totalFibre: number;
  totalCalories: number;
  avgBioavailability: number;
  avgGI: number;
}

export interface SmartSwap {
  remove: string;
  add: string;
  reason: string;
}

export interface AIAnalysisResult {
  healthNote: string;
  recipeSuggestion: string;
  cookingSteps: string[];
  weightLossSuggestion: string;
  isBalanced: boolean;
  synergyNotes: string;
  smartSwaps: SmartSwap[];
  error?: string;
}

export interface OptimizationCombo {
  id: number;
  ingredients: string[];
  description: string;
  proteinG: number;
  absorptionRate: string;
  absorbedG: string;
}

export interface FiberBioData {
  food: string;
  fiberG: number;
  bioavailability: string;
  absorptionNote: string;
}

export type SearchIntent = 'FIND_INGREDIENT' | 'GENERAL_QA' | 'MEAL_SETUP';

export interface AISearchResult {
  intent: SearchIntent;
  ingredientData?: Ingredient;
  qaAnswer?: string;
  mealSetup?: {
    ingredients: string[];
    reasoning: string;
  };
}
