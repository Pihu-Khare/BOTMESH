import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'botmesh.db');

// Initialize SQLite database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create tables on startup
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_uuid TEXT UNIQUE NOT NULL,
    model_name TEXT NOT NULL,
    start_time DATETIME DEFAULT (datetime('now')),
    end_time DATETIME,
    duration_seconds INTEGER,
    total_cost DECIMAL(10, 4),
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    message_text TEXT NOT NULL,
    response_text TEXT,
    role TEXT NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    cost DECIMAL(10, 4) DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_id INTEGER,
    amount DECIMAL(10, 4) NOT NULL,
    transaction_type TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
  CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
  CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
  CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
`);

// Query helper function (convert PostgreSQL syntax to SQLite)
export const query = (text, params = []) => {
  try {
    // Convert PostgreSQL syntax to SQLite
    let sqlText = text
      // Replace PostgreSQL parameter placeholders
      .replace(/\$1/g, '?')
      .replace(/\$2/g, '?')
      .replace(/\$3/g, '?')
      .replace(/\$4/g, '?')
      .replace(/\$5/g, '?')
      .replace(/\$6/g, '?')
      // Replace PostgreSQL functions with SQLite equivalents
      .replace(/CURRENT_TIMESTAMP/g, "datetime('now')")
      // Fix any remaining double quotes in function calls
      .replace(/datetime\("now"\)/g, "datetime('now')")
      .replace(/julianday\("now"\)/g, "julianday('now')")
      .replace(/"now"/g, "'now'");  // Catch any remaining "now" with double quotes

    if (text.toUpperCase().includes('INSERT') || text.toUpperCase().includes('UPDATE') || text.toUpperCase().includes('DELETE')) {
      const result = db.prepare(sqlText).run(...params);
      return {
        rows: [{ id: result.lastInsertRowid }],
        rowCount: result.changes
      };
    } else {
      const stmt = db.prepare(sqlText);
      const rows = stmt.all(...params);
      return {
        rows: rows,
        rowCount: rows.length
      };
    }
  } catch (error) {
    console.error('Database error:', error.message);
    console.error('SQL:', text);
    throw error;
  }
};

// Test connection
try {
  const result = db.prepare("SELECT datetime('now') as now").get();
  console.log('✅ SQLite Database connected at:', result.now);
} catch (err) {
  console.error('❌ Database connection failed:', err.message);
}

export default db;
