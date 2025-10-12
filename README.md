# 🌿 AI Meal Planner

Generate healthy, cholesterol-conscious meal plans and shopping lists tailored to your needs using the power of the Google Gemini API. This application is designed to help users create heart-healthy meal plans based on UK dietary standards, with a focus on lowering cholesterol.

## ✨ Features

- **Customized Meal Plans**: Specify the number of days (1-14) and people (1-10) for your plan.
- **Ingredient Exclusion**: Add a comma-separated list of ingredients or allergens to exclude from the generated plan.
- **Persistent Exclusions**: Save your exclusion list in your browser for future use.
- **Detailed Recipes**: Each meal comes with a full list of ingredients (quantities adjusted for the number of people) and step-by-step cooking instructions.
- **Organized Shopping List**: Automatically generates a consolidated shopping list, categorized by store aisle (e.g., Fresh Produce, Pantry Staples) for a convenient shopping experience.
- **Real-time Streaming**: The meal plan and shopping list are streamed from the AI, providing a responsive and fast user experience.
- **Responsive Design**: A clean, mobile-friendly interface built with Tailwind CSS.

## 💻 Technologies Used

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API (`gemini-2.5-flash` model) via `@google/genai` SDK

## 🚀 Getting Started

This is a static web application that communicates directly with the Google Gemini API from the client-side.

### Prerequisites

To run this application, you need a Google Gemini API key.

### Configuration

The API key **must** be provided as an environment variable named `API_KEY`. The application is configured to read `process.env.API_KEY` to authenticate with the Gemini API.

## 🤔 How It Works

1.  **User Input**: The user selects the number of days, number of people, and optionally enters a list of ingredients to exclude.
2.  **Prompt Engineering**: The `geminiService.ts` file constructs a detailed prompt for the Gemini API, incorporating the user's inputs and specifying the required format for the meal plan and shopping list.
3.  **API Call**: The application makes a streaming request to the `gemini-2.5-flash` model. Using a streaming response allows the UI to start displaying content as soon as the first chunks of data arrive.
4.  **Parsing & Display**: The `App.tsx` component receives the streamed text. It parses the text to separate the meal plan from the shopping list (using a `---SHOPPING LIST---` separator) and updates the state.
5.  **Rendering**: The `MealPlanDisplay.tsx` component uses a simple markdown-to-JSX renderer to display the formatted meal plan and shopping list in a user-friendly layout.

## 📂 Project Structure

```
.
├── components/          # Reusable React components
│   ├── IconComponents.tsx
│   ├── LoadingSpinner.tsx
│   ├── MealPlanDisplay.tsx
│   └── MealPlannerForm.tsx
├── services/            # Logic for interacting with external APIs
│   └── geminiService.ts
├── App.tsx              # Main application component and state management
├── index.html           # The entry point of the web app
├── index.tsx            # React root renderer
└── metadata.json        # Application metadata
```

## ✍️ Author

Imagined by MC.
