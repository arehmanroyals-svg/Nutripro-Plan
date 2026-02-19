
import { SelectedIngredient, MealStats, AIAnalysisResult, AISearchResult, IngredientCategory, UserGoal } from "../types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = "";

/**
 * Helper to call Groq with JSON mode enabled
 */
const callGroq = async (system: string, user: string) => {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: `${system}. You MUST return valid JSON. Accuracy is paramount.` },
        { role: "user", content: user }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1 // Low temperature for high factual accuracy
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error?.message || "Groq API Error");
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

export const analyzeMealPlan = async (
  ingredients: SelectedIngredient[],
  stats: MealStats,
  targetCalories: number,
  goal: UserGoal
): Promise<AIAnalysisResult> => {
  const ingredientList = ingredients
    .map((i) => `${(i.count * (i.weightInGrams || 100)).toFixed(0)}g ${i.name}`)
    .join(", ");

  const system = `You are an elite Indian Metabolic Nutritionist. 
  Goal: ${goal}. 
  Target Calories: ${targetCalories} kcal for this plate.
  Instructions: Analyze metabolic synergy, verify if the meal fits the calorie target, and provide cooking advice.
  Required JSON Structure:
  {
    "healthNote": "General analysis",
    "recipeSuggestion": "Dish Name",
    "cookingSteps": ["Step 1", "Step 2"],
    "weightLossSuggestion": "Specific advice relative to the ${targetCalories} target and ${goal} goal",
    "isBalanced": true,
    "synergyNotes": "Nutrient synergy info",
    "smartSwaps": [{"remove": "Item", "add": "Replacement", "reason": "Why"}]
  }`;

  const user = `
    Analyze this meal:
    Goal: ${goal}
    Target: ${targetCalories} kcal
    Ingredients: ${ingredientList}
    Current Stats: ${stats.totalCalories.toFixed(0)} kcal, ${stats.totalProtein.toFixed(1)}g Protein.
  `;

  try {
    return await callGroq(system, user);
  } catch (error: any) {
    return { 
      healthNote: "Metabolic engine temporarily offline.", 
      recipeSuggestion: "Healthy Indian Meal", 
      cookingSteps: ["Combine ingredients", "Cook thoroughly"],
      weightLossSuggestion: "Focus on portion control.",
      isBalanced: false,
      synergyNotes: "N/A",
      smartSwaps: []
    };
  }
};

export const processSearchQuery = async (query: string, availableIngredients: string[]): Promise<AISearchResult | null> => {
  const system = `You are a strict Nutritional Database Expert. 
  When intent is FIND_INGREDIENT:
  1. Return realistic values PER 100g of the food. 
  2. For "Milk Bread", provide stats for standard white milk bread (approx 260-290 kcal/100g, 8g protein).
  3. Never return calories > 900 per 100g. 
  4. Use standard Indian/Global food database values.
  5. Bioavailability: Proteins (Meat: 95%, Eggs: 97%, Legumes: 70%, Grains: 60%).

  Required JSON structure:
  {
    "intent": "FIND_INGREDIENT" | "GENERAL_QA" | "MEAL_SETUP",
    "ingredientData": {
       "name": "Corrected Food Name",
       "category": "Must be one of the provided categories",
       "protein": number, "carbs": number, "fibre": number, "calories": number,
       "weightInGrams": 100, "giIndex": number, "bioavailability": number,
       "unit": "100g", "vitamins": [], "minerals": []
    },
    "qaAnswer": "Concise answer if intent is QA",
    "mealSetup": { "ingredients": ["names"], "reasoning": "string" }
  }`;

  try {
    const result = await callGroq(system, query);
    if (result.intent === 'FIND_INGREDIENT' && result.ingredientData) {
       result.ingredientData.id = `custom-${Date.now()}`;
       result.ingredientData.weightInGrams = 100;
       result.ingredientData.unit = "100g";
    }
    return result;
  } catch (error) { 
    return null;
  }
};
