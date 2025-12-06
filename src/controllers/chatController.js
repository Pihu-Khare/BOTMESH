import AIService from '../services/aiService.js';
import SessionService from '../services/sessionService.js';
import { query } from '../../config/database.js';

export const sendMessage = async (req, res) => {
  try {
    const { sessionId, session_id, message } = req.body;
    const finalSessionId = sessionId || session_id;
    const userId = req.user.userId;

    if (!message || !finalSessionId) {
      return res.status(400).json({ error: 'Message and sessionId are required' });
    }

    // Verify session belongs to user
    const session = await SessionService.getSession(finalSessionId, userId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Save user message
    query(
      `INSERT INTO messages (session_id, user_id, message_text, role) 
       VALUES ($1, $2, $3, $4)`,
      [finalSessionId, userId, message, 'user']
    );

    // Generate AI response
    let aiResponse;
    try {
      aiResponse = await AIService.generateResponse(message, session.model_name);
      if (!aiResponse || aiResponse.trim() === '') {
        aiResponse = `I received your message: "${message}" but couldn't generate a proper response.`;
      }
    } catch (aiError) {
      // Fallback response if AI service fails
      aiResponse = `I'm unable to process your request right now. You said: "${message}"`;
    }

    // Save AI response
    query(
      `INSERT INTO messages (session_id, user_id, message_text, role) 
       VALUES ($1, $2, $3, $4)`,
      [finalSessionId, userId, aiResponse, 'assistant']
    );

    res.json({
      success: true,
      message: {
        user_message: message,
        ai_response: aiResponse,
        session_id: finalSessionId,
        input_tokens: 0,
        output_tokens: 0,
        cost: 0.0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // Verify session belongs to user
    const session = await SessionService.getSession(sessionId, userId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const result = query(
      'SELECT id, message_text, role, created_at FROM messages WHERE session_id = $1 ORDER BY created_at ASC',
      [sessionId]
    );

    res.json({
      success: true,
      messages: result.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { sendMessage, getMessages };
