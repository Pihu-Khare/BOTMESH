import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'botmesh_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },

  // Server
  server: {
    port: parseInt(process.env.PORT || '5000'),
    env: process.env.NODE_ENV || 'development',
    appUrl: process.env.APP_URL || 'http://localhost:5000',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-in-production',
    expiresIn: process.env.JWT_EXPIRATION || '24h',
  },

  // AI APIs
  googleAI: {
    apiKey: process.env.GOOGLE_API_KEY || '',
  },

  openAI: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },

  // App
  app: {
    name: process.env.APP_NAME || 'Bot Mesh',
  },
};

export default config;
