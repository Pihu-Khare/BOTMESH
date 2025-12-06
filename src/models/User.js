import bcrypt from 'bcryptjs';
import { query } from '../../config/database.js';

export class User {
  static async create(username, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
        [username, email, hashedPassword]
      );
      
      // Return the created user
      const user = query('SELECT id, username, email, created_at FROM users WHERE email = $1', [email]);
      return user.rows[0];
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const result = query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  static async findByUsername(username) {
    try {
      const result = query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find user by username: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const result = query('SELECT id, username, email, created_at, is_active FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Failed to find user by id: ${error.message}`);
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateLastLogin(userId) {
    try {
      query('UPDATE users SET updated_at = datetime("now") WHERE id = $1', [userId]);
    } catch (error) {
      console.error('Failed to update last login:', error.message);
    }
  }
}

export default User;
