import { Ingredient, IngredientCategory, OptimizationCombo, FiberBioData } from './types';

const createIngredient = (
  id: string,
  name: string,
  category: IngredientCategory,
  protein: number,
  carbs: number,
  fibre: number,
  bioavailability: number,
  calories: number,
  unit: string = '100g',
  weightInGrams: number = 100,
  giIndex: number = 0,
  vitamins: string[] = [],
  minerals: string[] = []
): Ingredient => ({
  id,
  name,
  category,
  protein,
  carbs,
  fibre,
  bioavailability,
  calories,
  unit,
  weightInGrams,
  giIndex,
  vitamins,
  minerals
});

export const INGREDIENTS: Ingredient[] = [
  createIngredient('v1', 'Spinach (Palak)', IngredientCategory.VEGETABLES, 2.9, 3.6, 2.2, 70, 23, '1 cup', 30, 15, ['A', 'C', 'K'], ['Iron', 'Calcium']),
  createIngredient('v2', 'Okra (Bhindi)', IngredientCategory.VEGETABLES, 1.9, 7.5, 3.2, 88, 33, '100g', 100, 20, ['C', 'K', 'B6'], ['Magnesium', 'Manganese']),
  createIngredient('v3', 'Cauliflower (Gobi)', IngredientCategory.VEGETABLES, 1.9, 5, 2, 80, 25, '100g', 100, 15, ['C', 'K', 'B6'], ['Potassium', 'Manganese']),
  createIngredient('v5', 'Potato (Aloo)', IngredientCategory.VEGETABLES, 2, 17, 2.2, 85, 77, '1 medium', 100, 78, ['C', 'B6'], ['Potassium', 'Manganese']),
  createIngredient('v6', 'Lemon', IngredientCategory.VEGETABLES, 1.1, 9, 2.8, 90, 29, '1 medium', 60, 20, ['C'], ['Potassium']),
  createIngredient('v7', 'Ginger', IngredientCategory.SPICES, 1.8, 18, 2, 80, 80, '1 tbsp', 15, 10, ['B6'], ['Magnesium', 'Potassium']),
  createIngredient('v8', 'Garlic', IngredientCategory.SPICES, 6.4, 33, 2.1, 80, 149, '1 clove', 3, 10, ['C', 'B6'], ['Manganese', 'Selenium']),
  createIngredient('v9', 'Onion', IngredientCategory.VEGETABLES, 1.1, 9, 1.7, 85, 40, '1 medium', 110, 10, ['C', 'B6', 'B9'], ['Manganese']),

  createIngredient('g1', 'White Rice', IngredientCategory.GRAINS, 3.5, 36, 0.6, 75, 170, '1 bowl cooked', 150, 72, ['B1', 'B3'], ['Selenium', 'Manganese']),
  createIngredient('g2', 'Brown Rice', IngredientCategory.GRAINS, 3.9, 34, 2.7, 78, 166, '1 bowl cooked', 150, 50, ['B1', 'B3', 'B6'], ['Magnesium', 'Phosphorus']),
  createIngredient('g3', 'Wheat Roti', IngredientCategory.GRAINS, 3, 17, 2.5, 75, 85, '1 medium', 40, 62, ['B1', 'B2', 'B3'], ['Iron', 'Magnesium']),
  createIngredient('g8', 'Ragi Flour', IngredientCategory.GRAINS, 7.3, 72, 11.5, 62, 328, '100g', 100, 54, ['B1', 'B2', 'B3'], ['Calcium', 'Iron', 'Potassium']),
  createIngredient('g9', 'Bajra (Pearl Millet)', IngredientCategory.GRAINS, 11, 67, 11.3, 68, 361, '100g', 100, 54, ['B1', 'B2', 'B3'], ['Iron', 'Magnesium', 'Zinc']),

  createIngredient('d1', 'Moong Dal', IngredientCategory.DALS_LEGUMES, 7, 18, 5, 65, 120, '1 bowl cooked', 150, 29, ['B1', 'B9'], ['Iron', 'Magnesium', 'Zinc']),
  createIngredient('d2', 'Masoor Dal', IngredientCategory.DALS_LEGUMES, 9, 20, 8, 70, 116, '1 bowl cooked', 150, 25, ['B1', 'B9'], ['Iron', 'Zinc']),
  createIngredient('d3', 'Toor Dal', IngredientCategory.DALS_LEGUMES, 8, 18, 5, 65, 120, '1 bowl cooked', 150, 29, ['B1', 'B9'], ['Iron', 'Magnesium']),
  createIngredient('d4', 'Rajma (Kidney Beans)', IngredientCategory.DALS_LEGUMES, 9, 23, 6.4, 68, 140, '1 bowl cooked', 150, 24, ['B1', 'B9', 'K'], ['Iron', 'Molybdenum', 'Potassium']),
  createIngredient('d5', 'Chana (Chickpeas)', IngredientCategory.DALS_LEGUMES, 8.9, 27, 7.6, 72, 164, '1 bowl cooked', 150, 28, ['B9', 'B1', 'B6'], ['Iron', 'Magnesium', 'Zinc']),

  createIngredient('da1', 'Curd (Yogurt)', IngredientCategory.DAIRY, 10, 4, 0, 88, 60, '1 bowl', 150, 15, ['B12', 'B2'], ['Calcium', 'Phosphorus']),
  createIngredient('da2', 'Milk', IngredientCategory.DAIRY, 6, 9, 0, 90, 103, '1 cup', 200, 15, ['B12', 'D', 'B2'], ['Calcium', 'Potassium']),
  createIngredient('da3', 'Paneer', IngredientCategory.DAIRY, 18, 1.2, 0, 93, 265, '100g', 100, 10, ['B12', 'A', 'D'], ['Calcium', 'Phosphorus']),

  createIngredient('p1', 'Egg', IngredientCategory.PROTEINS, 6, 0.6, 0, 97, 72, '1 large', 50, 0, ['A', 'B12', 'D', 'E'], ['Selenium', 'Iodine', 'Zinc']),
  createIngredient('p2', 'Chicken Breast', IngredientCategory.PROTEINS, 27, 0, 0, 95, 165, '100g', 100, 0, ['B3', 'B6', 'B12'], ['Selenium', 'Phosphorus', 'Zinc']),
  createIngredient('p3', 'Fish', IngredientCategory.PROTEINS, 20, 0, 0, 96, 110, '100g', 100, 0, ['B12', 'D'], ['Selenium', 'Iodine', 'Phosphorus']),
  
  createIngredient('n1', 'Almonds', IngredientCategory.NUTS_SEEDS, 21, 22, 12, 85, 579, '10 pieces', 12, 15, ['E', 'B2'], ['Magnesium', 'Manganese']),
  createIngredient('n2', 'Flaxseed', IngredientCategory.NUTS_SEEDS, 18, 29, 27.3, 58, 534, '1 tbsp', 10, 0, ['B1'], ['Manganese', 'Magnesium']),
  createIngredient('n3', 'Chia Seeds', IngredientCategory.NUTS_SEEDS, 17, 42, 34.4, 78, 486, '1 tbsp', 12, 0, ['B1', 'B3'], ['Manganese', 'Phosphorus', 'Calcium']),
];

export const PROTEIN_COMBOS: OptimizationCombo[] = [
  { id: 1, ingredients: ['Moong dal', 'Lemon'], description: 'Moong dal + lemon', proteinG: 7, absorptionRate: '80–85%', absorbedG: '~5.8' },
  { id: 2, ingredients: ['Masoor dal', 'Ginger'], description: 'Masoor dal + ginger', proteinG: 9, absorptionRate: '78–82%', absorbedG: '~7.2' },
  { id: 3, ingredients: ['Toor dal', 'Garlic'], description: 'Toor dal + garlic', proteinG: 8, absorptionRate: '75–80%', absorbedG: '~6.2' },
  { id: 4, ingredients: ['Rajma', 'Rice'], description: 'Rajma + rice', proteinG: 9, absorptionRate: '75–80%', absorbedG: '~7' },
  { id: 5, ingredients: ['Chana', 'Onion'], description: 'Chana + onion', proteinG: 8.9, absorptionRate: '70–75%', absorbedG: '~6.5' },
  { id: 6, ingredients: ['Dal', 'Roti'], description: 'Dal + wheat roti', proteinG: 7, absorptionRate: '75–80%', absorbedG: '~5.5' },
  { id: 7, ingredients: ['Rice', 'Moong'], description: 'Khichdi (rice+moong)', proteinG: 6, absorptionRate: '80–85%', absorbedG: '~5' },
  { id: 8, ingredients: ['Fermented'], description: 'Idli / Dosa (fermented)', proteinG: 5, absorptionRate: '85–90%', absorbedG: '~4.4' },
  { id: 9, ingredients: ['Chana dal', 'Brown rice'], description: 'Chana dal + brown rice', proteinG: 8, absorptionRate: '75–80%', absorbedG: '~6' },
  { id: 10, ingredients: ['Bajra', 'Moong dal'], description: 'Bajra roti + moong dal', proteinG: 7, absorptionRate: '70–75%', absorbedG: '~5' },
  { id: 11, ingredients: ['Curd', 'Chana'], description: 'Curd + roasted chana', proteinG: 10, absorptionRate: '85–90%', absorbedG: '~8.8' },
  { id: 12, ingredients: ['Paneer', 'Vegetables'], description: 'Paneer + veggies', proteinG: 18, absorptionRate: '90–95%', absorbedG: '~17' },
  { id: 13, ingredients: ['Milk', 'Almonds'], description: 'Milk + soaked almonds', proteinG: 6, absorptionRate: '88–92%', absorbedG: '~5.4' },
  { id: 14, ingredients: ['Egg', 'Vegetables'], description: 'Eggs + vegetables', proteinG: 13, absorptionRate: '95–98%', absorbedG: '~12.5' },
  { id: 15, ingredients: ['Egg', 'Roti'], description: 'Egg bhurji + roti', proteinG: 12, absorptionRate: '93–96%', absorbedG: '~11.5' },
  { id: 16, ingredients: ['Fish', 'Lemon'], description: 'Fish + lemon', proteinG: 20, absorptionRate: '95–98%', absorbedG: '~19' },
  { id: 17, ingredients: ['Chicken', 'Ginger', 'Garlic'], description: 'Chicken + ginger-garlic', proteinG: 27, absorptionRate: '94–97%', absorbedG: '~25.5' },
  { id: 18, ingredients: ['Mutton'], description: 'Mutton (slow cooked)', proteinG: 25, absorptionRate: '90–94%', absorbedG: '~23' },
  { id: 19, ingredients: ['Peanut', 'Jaggery'], description: 'Peanut + jaggery', proteinG: 26, absorptionRate: '70–75%', absorbedG: '~19' },
  { id: 20, ingredients: ['Legumes', 'Lemon'], description: 'Sprouted legumes + lemon', proteinG: 9, absorptionRate: '85–90%', absorbedG: '~8' },
  { id: 21, ingredients: ['Flax', 'Chia', 'Curd'], description: 'Soaked flax/chia + curd', proteinG: 6, absorptionRate: '75–80%', absorbedG: '~4.5' },
];

export const FIBER_DATA: FiberBioData[] = [
  { food: 'Guava', fiberG: 5.4, bioavailability: '85–90%', absorptionNote: '100g → ~5g absorbed' },
  { food: 'Chickpeas (Chana)', fiberG: 7.6, bioavailability: '70–75%', absorptionNote: '100g → ~5.5g' },
  { food: 'Oats', fiberG: 10.6, bioavailability: '75–80%', absorptionNote: '100g → ~8g' },
  { food: 'Bajra (Pearl millet)', fiberG: 11.3, bioavailability: '65–70%', absorptionNote: '100g → ~7.5g' },
  { food: 'Ragi (Finger millet)', fiberG: 11.5, bioavailability: '60–65%', absorptionNote: '100g → ~7g' },
  { food: 'Flaxseed', fiberG: 27.3, bioavailability: '55–60%', absorptionNote: '100g → ~16g' },
  { food: 'Okra (Bhindi)', fiberG: 3.2, bioavailability: '85–90%', absorptionNote: '100g → ~2.8g' },
  { food: 'Apple (with peel)', fiberG: 2.4, bioavailability: '80–85%', absorptionNote: '100g → ~2g' },
  { food: 'Rajma (Kidney beans)', fiberG: 6.4, bioavailability: '65–70%', absorptionNote: '100g → ~4.5g' },
  { food: 'Isabgol (Psyllium husk)', fiberG: 70, bioavailability: '50–55%', absorptionNote: '10g → ~3.5g' },
];

export const CATEGORIES = Object.values(IngredientCategory);