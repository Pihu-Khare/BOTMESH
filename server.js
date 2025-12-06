import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/environment.js';

// Import routes
import authRoutes from './src/routes/auth.js';
import chatRoutes from './src/routes/chat.js';
import sessionRoutes from './src/routes/sessions.js';
import modelRoutes from './src/routes/models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files from public/
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/sessions', sessionRoutes);
app.use('/api/v1/models', modelRoutes);

// Legacy routes (for backward compatibility with existing frontend)
app.get('/models', (req, res) => {
  res.json(['GPT-5', 'Claude', 'Mistral', 'LLaMA']);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`✅ Bot Mesh running at http://localhost:${PORT}`);
  console.log(`📚 API docs at http://localhost:${PORT}/api/v1`);
});
