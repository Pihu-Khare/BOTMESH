import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/environment.js';

const genAI = new GoogleGenerativeAI(config.googleAI.apiKey);

export class AIService {
  static async generateResponse(message, model = 'gemini-pro') {
    try {
      if (!config.googleAI.apiKey) {
        // Fallback for development/testing without API key
        return `[Mock AI Response] You said: "${message}". This is a simulated response.`;
      }

      try {
        const generativeModel = genAI.getGenerativeModel({ model });
        const result = await generativeModel.generateContent(message);
        const response = await result.response;
        const text = response.text();

        if (!text || text.trim() === '') {
          return `[AI Response] I received your message: "${message}" but cannot generate a complete response at this time.`;
        }

        return text;
      } catch (aiError) {
        console.error('Google AI Error:', aiError.message);
        // Fallback response
        return `[Mock AI Response] I couldn't process that with the API, but I understand you said: "${message}"`;
      }
    } catch (error) {
      console.error('AI Service Error:', error.message);
      return `[Error] Failed to generate response: ${error.message}`;
    }
  }

  static async countTokens(text) {
    try {
      const generativeModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await generativeModel.countTokens(text);
      return result.totalTokens;
    } catch (error) {
      console.error('Token counting error:', error.message);
      // Estimate: roughly 1 token per 4 characters
      return Math.ceil(text.length / 4);
    }
  }

  static getAvailableModels() {
    return ['gemini-pro', 'gemini-pro-vision'];
  }
}

export default AIService;
