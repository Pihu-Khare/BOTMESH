# Bot Mesh - Phase 1 Setup Guide

## 🚀 Quick Start

Phase 1 implementation includes:
- ✅ Database setup (PostgreSQL)
- ✅ User authentication (register/login with JWT)
- ✅ Modular backend architecture
- ✅ Google Generative AI integration
- ✅ Dashboard & authentication UI

## Prerequisites

- **Node.js** (v16+)
- **PostgreSQL** (v12+)
- **npm** (comes with Node.js)
- **Google Generative AI API Key** (free tier available)

## Installation Steps

### 1. Install PostgreSQL

**On Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Run installer and remember the password you set for `postgres` user
- Add PostgreSQL to PATH

**Verify installation:**
```powershell
psql --version
```

### 2. Create Database

Open PowerShell and connect to PostgreSQL:

```powershell
psql -U postgres
```

Enter your PostgreSQL password when prompted. Then run:

```sql
CREATE DATABASE botmesh_db;
\c botmesh_db
```

Copy the SQL from `database/schema.sql` and paste it into the psql terminal to create all tables.

Exit psql:
```sql
\q
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env`:

```powershell
copy .env.example .env
```

Edit `.env` with your settings:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=botmesh_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRATION=24h

# Google AI
GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Get Google Generative AI API Key

1. Go to: https://ai.google.dev
2. Click "Get API Key"
3. Create a new API key (free tier available)
4. Copy the key to your `.env` file

### 5. Install Dependencies

```powershell
cd c:\Users\pihuj\Botm\BOTMESH
npm install
```

### 6. Start the Server

```powershell
npm start
```

You should see:
```
✅ Bot Mesh running at http://localhost:5000
📚 API docs at http://localhost:5000/api/v1
✅ Database connected at: [timestamp]
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create new account
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/profile` - Get user profile (requires token)

### Sessions
- `POST /api/v1/sessions/start` - Start new session
- `POST /api/v1/sessions/end/:sessionId` - End session
- `GET /api/v1/sessions` - Get user's sessions
- `GET /api/v1/sessions/:sessionId` - Get specific session

### Chat
- `POST /api/v1/chat/message` - Send message in session
- `GET /api/v1/chat/:sessionId/messages` - Get session messages

### Models
- `GET /api/v1/models` - List available models

## 🌐 Frontend Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page with features |
| Auth | `/auth.html` | Login & Register |
| Dashboard | `/dashboard.html` | User hub - sessions, stats, profile |
| Chat | `/chat.html` | Chat interface (legacy, will be updated) |

## 🔐 Authentication Flow

1. User registers/logs in on `/auth.html`
2. Server returns JWT token
3. Token stored in `localStorage`
4. Sent as `Authorization: Bearer <token>` in protected endpoints
5. Token verified by `authMiddleware`

### Example Request with Token:

```javascript
const response = await fetch('http://localhost:5000/api/v1/sessions', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

## 📁 Project Structure

```
BOTMESH/
├── config/
│   ├── environment.js      # Config loader
│   └── database.js         # PostgreSQL connection
├── src/
│   ├── models/
│   │   └── User.js         # User database operations
│   ├── controllers/
│   │   ├── authController.js
│   │   └── chatController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── sessions.js
│   │   └── models.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── services/
│   │   ├── aiService.js    # Google AI integration
│   │   └── sessionService.js
│   └── utils/
│       └── jwt.js
├── public/
│   ├── index.html          # Home/landing page
│   ├── auth.html           # Login/Register
│   ├── dashboard.html      # User dashboard
│   └── chat.html           # Chat interface
├── database/
│   └── schema.sql          # Database schema
└── server.js               # Main server file
```

## 🧪 Testing Endpoints

### Register User

```powershell
curl -X POST http://localhost:5000/api/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Start Session

```powershell
curl -X POST http://localhost:5000/api/v1/sessions/start `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN_HERE" `
  -d '{"model": "gemini-pro"}'
```

### Send Message

```powershell
curl -X POST http://localhost:5000/api/v1/chat/message `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer YOUR_TOKEN_HERE" `
  -d '{
    "sessionId": 1,
    "message": "Hello, how are you?"
  }'
```

## 🐛 Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running: `Get-Process | grep postgres`
- Check DB credentials in `.env`
- Ensure `botmesh_db` database exists

### Port Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID PID_NUMBER /F
```

### API Key Errors
- Verify `GOOGLE_API_KEY` is set in `.env`
- Check API key is valid at: https://ai.google.dev
- API might have rate limits (free tier: 60 requests/min)

### Token Invalid
- Check token hasn't expired (default 24h)
- Verify token format: `Bearer <token>`
- Clear browser cache and localStorage

## 📖 Next Steps (Phase 2)

- Payment gateway integration (Stripe/PayPal)
- Accurate per-token billing
- Invoice generation
- Advanced analytics dashboard

## 🆘 Support

For issues:
1. Check logs in terminal
2. Verify `.env` configuration
3. Ensure PostgreSQL is running
4. Check internet connection for API calls
5. Review database schema in `database/schema.sql`

## 📝 Notes

- Default billing: $0.05/minute (will change to per-token in Phase 2)
- Sessions stored in database with full history
- Messages automatically saved for analytics
- All passwords hashed with bcrypt (10 rounds)
- JWT tokens expire after 24 hours
