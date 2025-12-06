import express from 'express';
import AIService from '../services/aiService.js';

const router = express.Router();

router.get('/', (req, res) => {
  const models = [
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Fast and efficient AI model' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'Advanced language understanding' },
    { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', description: 'Safe and helpful AI' },
    { id: 'mistral', name: 'Mistral', provider: 'Mistral AI', description: 'Open-source efficient model' },
  ];

  res.json({
    models,
    availableNow: ['gemini-pro'],
  });
});

export default router;
