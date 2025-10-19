# Meal Planner Backend

A Node.js/Express server that proxies requests to the Google Gemini API.

## Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Set environment variable:
   ```bash
   export GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. Run the server:
   ```bash
   npm start
   ```

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required)
- `PORT`: Port to run the server on (default: 3001)

## Deployment Options

### Railway
1. Connect your GitHub repository
2. Set `GEMINI_API_KEY` environment variable
3. Deploy automatically

### Render
1. Connect your GitHub repository  
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Set `GEMINI_API_KEY` environment variable

### Heroku
```bash
heroku create your-app-name
heroku config:set GEMINI_API_KEY=your_key_here
git subtree push --prefix backend heroku main
```

### Vercel (Serverless)
See `backend/api/` directory for serverless function deployment.

## API Endpoints

- `GET /health` - Health check
- `POST /api/generate-meal-plan` - Generate meal plan and shopping list

### Request Body for `/api/generate-meal-plan`:
```json
{
  "days": 7,
  "people": 2,
  "excludedIngredients": "nuts, shellfish"
}
```