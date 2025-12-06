# Bot Mesh API Reference - Phase 1

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained from `/auth/register` or `/auth/login` endpoints.

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "string (required, unique)",
  "email": "string (required, unique, valid email)",
  "password": "string (required, min 6 chars)",
  "confirmPassword": "string (required, must match password)"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing fields, invalid format, passwords don't match
- `409` - Email or username already exists
- `500` - Server error

---

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

---

### Get User Profile
```
GET /auth/profile
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2025-12-07T10:30:00Z",
    "is_active": true
  }
}
```

**Error Responses:**
- `401` - No token or invalid token
- `404` - User not found
- `500` - Server error

---

## Session Endpoints

### Start New Session
```
POST /sessions/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "model": "string (required, e.g., 'gemini-pro')"
}
```

**Success Response (201):**
```json
{
  "message": "Session started",
  "session": {
    "id": 1,
    "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "model_name": "gemini-pro",
    "start_time": "2025-12-07T10:30:00Z"
  }
}
```

**Error Responses:**
- `400` - Model not provided
- `401` - No token or invalid token
- `500` - Server error

---

### End Session
```
POST /sessions/end/:sessionId
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "message": "Session ended",
  "duration": 300,
  "durationMinutes": 5,
  "cost": "0.25"
}
```

**Error Responses:**
- `401` - No token or invalid token
- `404` - Session not found
- `500` - Server error

---

### Get User Sessions
```
GET /sessions
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 50) - Number of sessions to retrieve

**Success Response (200):**
```json
{
  "sessions": [
    {
      "id": 1,
      "user_id": 1,
      "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
      "model_name": "gemini-pro",
      "start_time": "2025-12-07T10:30:00Z",
      "end_time": "2025-12-07T10:35:00Z",
      "duration_seconds": 300,
      "total_cost": "0.25",
      "status": "completed",
      "created_at": "2025-12-07T10:30:00Z"
    }
  ]
}
```

**Error Responses:**
- `401` - No token or invalid token
- `500` - Server error

---

### Get Specific Session
```
GET /sessions/:sessionId
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "session": {
    "id": 1,
    "user_id": 1,
    "session_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "model_name": "gemini-pro",
    "start_time": "2025-12-07T10:30:00Z",
    "end_time": "2025-12-07T10:35:00Z",
    "duration_seconds": 300,
    "total_cost": "0.25",
    "status": "completed",
    "created_at": "2025-12-07T10:30:00Z"
  }
}
```

**Error Responses:**
- `401` - No token or invalid token
- `404` - Session not found
- `500` - Server error

---

## Chat Endpoints

### Send Message
```
POST /chat/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": number (required),
  "message": "string (required)"
}
```

**Success Response (200):**
```json
{
  "userMessageId": 1,
  "aiMessageId": 2,
  "response": "This is the AI response to your message..."
}
```

**Error Responses:**
- `400` - Missing sessionId or message
- `401` - No token or invalid token
- `404` - Session not found
- `500` - Server error (AI API issues, etc.)

---

### Get Session Messages
```
GET /chat/:sessionId/messages
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "messages": [
    {
      "id": 1,
      "message_text": "Hello, how are you?",
      "role": "user",
      "created_at": "2025-12-07T10:30:15Z"
    },
    {
      "id": 2,
      "message_text": "I'm doing great! How can I help you?",
      "role": "assistant",
      "created_at": "2025-12-07T10:30:16Z"
    }
  ]
}
```

**Error Responses:**
- `401` - No token or invalid token
- `404` - Session not found
- `500` - Server error

---

## Models Endpoint

### List Available Models
```
GET /models
Authorization: Bearer <token> (optional)
```

**Success Response (200):**
```json
{
  "models": [
    {
      "id": "gemini-pro",
      "name": "Gemini Pro",
      "provider": "Google",
      "description": "Fast and efficient AI model"
    },
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "provider": "OpenAI",
      "description": "Advanced language understanding"
    },
    {
      "id": "claude-3",
      "name": "Claude 3",
      "provider": "Anthropic",
      "description": "Safe and helpful AI"
    },
    {
      "id": "mistral",
      "name": "Mistral",
      "provider": "Mistral AI",
      "description": "Open-source efficient model"
    }
  ],
  "availableNow": ["gemini-pro"]
}
```

**Error Responses:**
- `500` - Server error

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists (email/username) |
| 500 | Internal Server Error - Server issue |

---

## Example Workflow

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "email": "alice@example.com",
    "password": "secure123",
    "confirmPassword": "secure123"
  }'
```

**Save the returned token in a variable:**
```powershell
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Start a Session
```bash
curl -X POST http://localhost:5000/api/v1/sessions/start \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{"model": "gemini-pro"}'
```

**Save the session ID:**
```powershell
$sessionId = 1
```

### 3. Send a Message
```bash
curl -X POST http://localhost:5000/api/v1/chat/message \
  -H "Authorization: Bearer $token" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": '$sessionId',
    "message": "What is machine learning?"
  }'
```

### 4. Get Chat History
```bash
curl -X GET http://localhost:5000/api/v1/chat/$sessionId/messages \
  -H "Authorization: Bearer $token"
```

### 5. End Session
```bash
curl -X POST http://localhost:5000/api/v1/sessions/end/$sessionId \
  -H "Authorization: Bearer $token"
```

---

## Token Format

JWT tokens are signed and contain:
```json
{
  "userId": 1,
  "email": "user@example.com",
  "iat": 1701935400,
  "exp": 1702021800
}
```

Tokens expire after 24 hours (configurable in `.env`).

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Description of what went wrong"
}
```

Example:
```json
{
  "error": "Invalid email or password"
}
```

---

## Rate Limiting

Currently not implemented. Phase 2 will include rate limiting.

---

## CORS

CORS is enabled for all origins in development. This will be restricted in production.

---

## Versioning

API is versioned at `/api/v1`. Future versions will use `/api/v2`, etc.

---

## Future Endpoints (Phase 2+)

- `GET /billing/transactions` - Transaction history
- `GET /billing/invoice/:id` - Download invoice
- `POST /admin/users` - Create user (admin)
- `PUT /admin/users/:id` - Update user (admin)
- `GET /analytics/dashboard` - Usage analytics
