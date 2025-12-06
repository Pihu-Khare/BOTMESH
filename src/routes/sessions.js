import express from 'express';
import SessionService from '../services/sessionService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

// Start a new session
router.post('/start', async (req, res) => {
  try {
    const { model } = req.body;
    const userId = req.user.userId;

    if (!model) {
      return res.status(400).json({ error: 'Model is required' });
    }

    const session = await SessionService.createSession(userId, model);
    res.status(201).json({
      success: true,
      message: 'Session started',
      session,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End a session
router.post('/end/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    const session = await SessionService.endSession(sessionId, userId);
    const durationMinutes = Math.ceil(session.duration_seconds / 60);
    const cost = (durationMinutes * 0.05).toFixed(2);

    res.json({
      success: true,
      message: 'Session ended',
      session: {
        ...session,
        duration: session.duration_seconds,
        durationMinutes,
        cost,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user sessions
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const sessions = await SessionService.getUserSessions(userId);

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific session
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    const session = await SessionService.getSession(sessionId, userId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
