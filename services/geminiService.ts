// Backend API base URL - change this to your deployed backend URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com'  // Replace with your deployed backend URL
  : 'http://localhost:3001';

// Custom stream response to mimic GoogleGenAI stream format
class MealPlanStream {
  private reader: ReadableStreamDefaultReader<Uint8Array>;
  private decoder: TextDecoder;

  constructor(response: Response) {
    if (!response.body) {
      throw new Error('No response body');
    }
    this.reader = response.body.getReader();
    this.decoder = new TextDecoder();
  }

  async *[Symbol.asyncIterator]() {
    try {
      while (true) {
        const { done, value } = await this.reader.read();
        if (done) break;

        const text = this.decoder.decode(value, { stream: true });
        if (text) {
          yield { text };
        }
      }
    } finally {
      this.reader.releaseLock();
    }
  }
}

export const generateMealPlanStream = async (days: number, people: number, excludedIngredients: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-meal-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        days,
        people,
        excludedIngredients
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return new MealPlanStream(response);
  } catch (error) {
    console.error('Error calling backend API:', error);
    throw error;
  }
};