import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'undefined') {
  console.error('API key not found. Expected process.env.API_KEY to be set.');
  throw new Error('API Key must be set. Please check your environment configuration.');
}

const ai = new GoogleGenAI({ apiKey });

export const generateMealPlanStream = async (days: number, people: number, excludedIngredients: string) => {

  const exclusionsPrompt = excludedIngredients.trim()
    ? `\nIMPORTANT: The meal plan MUST NOT, under any circumstances, include the following ingredients: ${excludedIngredients.trim()}.`
    : '';

  const prompt = `
You are an expert nutritionist and meal planner specializing in heart-healthy, cholesterol-lowering diets, with a focus on UK standards.

Generate a detailed meal plan for ${days} days for ${people} people.

The plan MUST focus on lowering cholesterol. This means:
- High in soluble fiber (oats, barley, beans, lentils, fruits, vegetables).
- Rich in healthy unsaturated fats (avocados, nuts, seeds, olive oil).
- Includes plant-based proteins.
- Minimizes saturated fats, trans fats, and processed foods.
- No red meat or full-fat dairy. Focus on fish, poultry, and plant proteins.
${exclusionsPrompt}
- All ingredient measurements in both the meal plan and the shopping list MUST be in UK standard metric units (e.g., grams, kilograms, millilitres, litres). Common household measures like tablespoons (tbsp) and teaspoons (tsp) are also acceptable.

Provide the output in two distinct sections separated by '---SHOPPING LIST---'.

SECTION 1: MEAL PLAN
- First, provide a summary table of the entire meal plan. The table must be in markdown format with columns: | Day | Breakfast | Lunch | Dinner |.
- After the summary table, detail the daily plan.
- Format each day with a '## Day X' heading.
- For each day, provide sections for '### Breakfast: [Meal Name]', '### Lunch: [Meal Name]', and '### Dinner: [Meal Name]'. You must include a descriptive meal name after the meal type.
- For each meal, list the ingredients under a '**Ingredients:**' subheading. Quantities MUST be adjusted for ${people} people.
- Provide clear, step-by-step cooking instructions under a '**Instructions:**' subheading.

SECTION 2: SHOPPING LIST
- After the separator, create a consolidated shopping list for all ingredients needed for the entire plan.
- The list should be categorized for easy shopping at a store like Tesco (e.g., '#### Fresh Produce', '#### Proteins', '#### Dairy & Alternatives', '#### Pantry Staples', '#### Spices & Oils').
- Use markdown bullet points ('* ') for each list item.
- Ensure shopping list quantities also use UK metric units (e.g., 500g bag of oats, 1 litre carton of oat milk).

Begin the response now.
`;

  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 0 } // Use thinkingBudget: 0 for faster response in this text-generation task
    }
  });

  return response;
};