import React, { useState, useEffect } from 'react';
import { SaveIcon, TrashIcon } from './IconComponents';

interface MealPlannerFormProps {
  onSubmit: (days: number, people: number, excludedIngredients: string) => void;
  loading: boolean;
}

const MealPlannerForm: React.FC<MealPlannerFormProps> = ({ onSubmit, loading }) => {
  const [days, setDays] = useState(1);
  const [people, setPeople] = useState(1);
  const [excludedIngredients, setExcludedIngredients] = useState('');
  const [saveStatus, setSaveStatus] = useState('');

  // Load excluded ingredients from localStorage on component mount
  useEffect(() => {
    const savedList = localStorage.getItem('excludedIngredientsList');
    if (savedList) {
      setExcludedIngredients(savedList);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(days, people, excludedIngredients);
  };

  const handleSaveList = () => {
    localStorage.setItem('excludedIngredientsList', excludedIngredients);
    setSaveStatus('List saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000); // Hide message after 3 seconds
  };

  const handleClearList = () => {
    localStorage.removeItem('excludedIngredientsList');
    setExcludedIngredients('');
    setSaveStatus('List cleared!');
    setTimeout(() => setSaveStatus(''), 3000); // Hide message after 3 seconds
  };

  const handleExclusionRemove = (itemToRemove: string) => {
    const currentItems = excludedIngredients.split(',').map(s => s.trim()).filter(Boolean);
    const newItems = currentItems.filter(item => item.toLowerCase() !== itemToRemove.toLowerCase());
    setExcludedIngredients(newItems.join(', '));
  };

  // Create a clean list for display, filtering out empty strings
  const exclusionList = excludedIngredients.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Number of Days */}
        <div>
          <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Days
          </label>
          <select
            id="days"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
            disabled={loading}
          >
            {Array.from({ length: 14 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day} {day === 1 ? 'day' : 'days'}
              </option>
            ))}
          </select>
        </div>

        {/* Number of People */}
        <div>
          <label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-1">
            Number of People
          </label>
          <select
            id="people"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
            disabled={loading}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((person) => (
              <option key={person} value={person}>
                {person} {person === 1 ? 'person' : 'people'}
              </option>
            ))}
          </select>
        </div>

        {/* Excluded Ingredients */}
        <div className="md:col-span-3">
          <label htmlFor="excludedIngredients" className="block text-sm font-medium text-gray-700 mb-1">
            Excluded Ingredients (optional, comma-separated)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              id="excludedIngredients"
              value={excludedIngredients}
              onChange={(e) => setExcludedIngredients(e.target.value)}
              placeholder="e.g., nuts, shellfish, mushrooms"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
              disabled={loading}
            />
            <button
              type="button"
              onClick={handleSaveList}
              title="Save List"
              disabled={loading}
              className="p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg disabled:bg-gray-400 transition-colors"
            >
              <SaveIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleClearList}
              title="Clear List"
              disabled={loading}
              className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:bg-gray-400 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
           {saveStatus && <p className="text-sm text-gray-600 mt-2">{saveStatus}</p>}
        </div>
        
        {/* Display Excluded Items */}
        {exclusionList.length > 0 && (
          <div className="md:col-span-3 mt-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-sm font-medium text-gray-800 mb-3">Current Exclusion List</h4>
            <div role="list" className="flex flex-wrap gap-3">
              {exclusionList.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  role="listitem"
                  className="flex items-center gap-2 bg-yellow-100 border border-yellow-200 text-yellow-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full"
                >
                  <label htmlFor={`exclude-${item}-${index}`} className="cursor-pointer">
                    {item}
                  </label>
                  <input
                    type="checkbox"
                    id={`exclude-${item}-${index}`}
                    checked={true}
                    onChange={() => handleExclusionRemove(item)}
                    title={`Click to remove '${item}' from the list`}
                    aria-label={`Remove ${item} from exclusion list`}
                    className="h-4 w-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating...' : 'Create My Meal Plan'}
        </button>
      </div>
    </form>
  );
};

export default MealPlannerForm;
