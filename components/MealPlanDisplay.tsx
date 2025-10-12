import React from 'react';
import { CartIcon } from './IconComponents.tsx';

interface MealPlanDisplayProps {
  mealPlan: string;
  shoppingList: string;
}

const renderMarkdown = (text: string) => {
  if (!text) return null;

  const elements: React.ReactNode[] = [];
  const lines = text.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl md:text-3xl font-bold mt-6 mb-3 pb-2 border-b-2 border-green-200">{line.substring(3)}</h2>);
      i++;
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl md:text-2xl font-semibold mt-5 mb-2 text-green-700">{line.substring(4)}</h3>);
      i++;
    } else if (line.startsWith('#### ')) {
      elements.push(<h4 key={i} className="text-lg font-semibold mt-4 mb-2 text-gray-700">{line.substring(5)}</h4>);
      i++;
    } else if (line.startsWith('**')) {
      const content = line.replace(/\*\*/g, '');
      elements.push(<p key={i} className="font-bold text-md text-gray-800 my-2">{content}</p>);
      i++;
    } else if (line.startsWith('* ')) {
      elements.push(<li key={i} className="ml-5 list-disc text-gray-700 leading-relaxed">{line.substring(2)}</li>);
      i++;
    } else if (line.startsWith('|')) { // Potential table block
      const headerLine = line;
      const separatorLine = lines[i + 1]?.trim();
      
      // A markdown table separator line consists of pipes, hyphens, and optional colons.
      const isSeparatorLine = (str: string) => {
        if (!str) return false;
        // Check if the line contains at least 3 hyphens, and only contains hyphens, pipes, colons, and whitespace.
        return str.includes('---') && str.replace(/[-|: ]/g, '').length === 0;
      };

      if (isSeparatorLine(separatorLine)) {
        const parseRow = (rowLine: string): string[] => {
            // Trim leading/trailing pipes and whitespace, then split by pipe.
            return rowLine.replace(/^\s*\||\|\s*$/g, '').split('|').map(cell => cell.trim());
        };

        const headerCells = parseRow(headerLine);
        const header = (
          <tr key={`tr-header-${i}`}>
            {headerCells.map((cell, ci) => (
              <th key={`th-${i}-${ci}`} className="py-3 px-4 text-left font-semibold text-gray-700">{cell}</th>
            ))}
          </tr>
        );
        
        const bodyRows: React.ReactNode[] = [];
        let j = i + 2; // Start after header and separator
        while (j < lines.length && lines[j].trim().startsWith('|')) {
          const bodyCells = parseRow(lines[j].trim());
          
          // Ensure row has the same number of columns as the header for valid table structure
          if (bodyCells.length === headerCells.length) {
            bodyRows.push(
              <tr key={`tr-body-${j}`} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                {bodyCells.map((cell, ci) => (
                  <td key={`td-${j}-${ci}`} className="py-3 px-4 text-gray-600">{cell}</td>
                ))}
              </tr>
            );
          }
          j++;
        }
        
        elements.push(
          <div key={`table-wrapper-${i}`} className="overflow-x-auto my-6">
            <table className="w-full text-sm border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">{header}</thead>
              <tbody>{bodyRows}</tbody>
            </table>
          </div>
        );
        
        i = j; // Move index past the table block
      } else {
         // Not a valid table, render as paragraph
         elements.push(<p key={i} className="my-1 text-gray-700 leading-relaxed">{line}</p>);
         i++;
      }
    } else if (line === '') {
      elements.push(<div key={i} className="h-2" />);
      i++;
    } else {
      elements.push(<p key={i} className="my-1 text-gray-700 leading-relaxed">{line}</p>);
      i++;
    }
  }
  return elements;
};


const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ mealPlan, shoppingList }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Your Meal Plan</h2>
        <div>{renderMarkdown(mealPlan)}</div>
      </div>
      <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 self-start sticky top-8">
        <div className="flex items-center gap-3 mb-4">
          <CartIcon className="w-8 h-8 text-green-500" />
          <h2 className="text-2xl font-bold text-gray-900">Shopping List</h2>
        </div>
        <div>{renderMarkdown(shoppingList)}</div>
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default MealPlanDisplay;