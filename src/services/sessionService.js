import { v4 as uuidv4 } from 'uuid';
import { query } from '../../config/database.js';

export class SessionService {
  static async createSession(userId, modelName) {
    try {
      const sessionUUID = uuidv4();
      query(
        'INSERT INTO sessions (user_id, session_uuid, model_name) VALUES ($1, $2, $3)',
        [userId, sessionUUID, modelName]
      );
      
      // Retrieve the created session
      const result = query(
        'SELECT id, session_uuid, model_name, start_time FROM sessions WHERE session_uuid = $1',
        [sessionUUID]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  static async endSession(sessionId, userId) {
    try {
      query(
        `UPDATE sessions 
         SET end_time = datetime('now'), 
             status = 'completed',
             duration_seconds = CAST((julianday('now') - julianday(start_time)) * 86400 AS INTEGER)
         WHERE id = $1 AND user_id = $2`,
        [sessionId, userId]
      );

      const result = query(
        'SELECT id, duration_seconds, total_cost FROM sessions WHERE id = $1 AND user_id = $2',
        [sessionId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Session not found');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to end session: ${error.message}`);
    }
  }

  static async getSession(sessionId, userId) {
    try {
      const result = query(
        'SELECT * FROM sessions WHERE id = $1 AND user_id = $2',
        [sessionId, userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to get session: ${error.message}`);
    }
  }

  static async getUserSessions(userId, limit = 50) {
    try {
      const result = query(
        'SELECT * FROM sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
        [userId, limit]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to get user sessions: ${error.message}`);
    }
  }
}

export default SessionService;
