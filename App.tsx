import React, { useState } from 'react';
import MealPlannerForm from './components/MealPlannerForm.tsx';
import MealPlanDisplay from './components/MealPlanDisplay.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import { generateMealPlanStream } from './services/geminiService.ts';

function App() {
  const [mealPlan, setMealPlan] = useState('');
  const [shoppingList, setShoppingList] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = async (days: number, people: number, excludedIngredients: string) => {
    setLoading(true);
    setError(null);
    setMealPlan('');
    setShoppingList('');

    try {
      const stream = await generateMealPlanStream(days, people, excludedIngredients);
      let combinedText = '';
      const separator = '---SHOPPING LIST---';

      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          combinedText += text;
          const separatorIndex = combinedText.indexOf(separator);

          if (separatorIndex !== -1) {
            setMealPlan(combinedText.substring(0, separatorIndex));
            setShoppingList(combinedText.substring(separatorIndex + separator.length));
          } else {
            setMealPlan(combinedText);
          }
        }
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`An error occurred while generating the meal plan: ${errorMessage}. Please check your API key and try again.`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleClearPlan = () => {
    setMealPlan('');
    setShoppingList('');
  };

  return (
    <div className="bg-green-50 min-h-screen font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-green-800">
            🌿 Heart-Healthy Meal Planner
          </h1>
          <p className="text-center text-gray-600 mt-1">
            AI-powered meal plans to help lower cholesterol, based on UK standards.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MealPlannerForm onSubmit={handleGeneratePlan} loading={loading} />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {loading && <LoadingSpinner />}
        {(mealPlan || shoppingList) && !loading && (
          <>
            <div className="text-center mb-6">
              <button
                onClick={handleClearPlan}
                className="px-6 py-2 border border-red-500 text-red-500 font-medium rounded-full hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-colors"
                aria-label="Clear the current meal plan and shopping list to start over"
              >
                Clear Plan and List
              </button>
            </div>
            <MealPlanDisplay mealPlan={mealPlan} shoppingList={shoppingList} />
          </>
        )}
      </main>

       <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Google Gemini API. Imagined by MC.</p>
      </footer>
    </div>
  );
}

export default App;