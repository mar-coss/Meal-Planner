export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is required' });
  }

  try {
    const { days, people, excludedIngredients } = req.body;

    if (!days || !people) {
      return res.status(400).json({ error: 'Days and people are required' });
    }

    const exclusionsPrompt = excludedIngredients?.trim()
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

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    // Set response headers for streaming
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // For Vercel, we need to handle streaming differently
    const reader = geminiResponse.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                res.write(data.candidates[0].content.parts[0].text);
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      res.end();
    }

  } catch (error) {
    console.error('Error generating meal plan:', error);
    res.status(500).json({ 
      error: 'Failed to generate meal plan',
      details: error.message 
    });
  }
}