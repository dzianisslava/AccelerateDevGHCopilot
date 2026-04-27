# OAuth2 + JWT Implementation - Quick Start Guide

## ✅ What's Been Implemented

Your Express/TypeScript app now has a complete OAuth2 + JWT authentication system with support for:
- **Google OAuth**
- **GitHub OAuth**
- **Microsoft OAuth**
- **JWT Token Generation & Validation**
- **Protected API Routes**
- **Beautiful Login & Success Pages**

## 📁 New Files Created

```
src/auth/
├── jwt.ts              # JWT token generation/verification
└── passport.ts         # OAuth2 strategies (Google, GitHub, Microsoft)

src/middleware/
└── auth.ts             # JWT validation middleware

src/routes/
├── auth.ts             # OAuth callback routes (NEW)
└── index.ts            # Updated with protected endpoints & login routes

src/views/
├── login.pug           # OAuth login page (NEW)
└── auth-success.pug    # Token display page (NEW)

Documentation & Examples:
├── OAUTH_SETUP_GUIDE.md           # Complete setup instructions
├── OAUTH_CLIENT_JAVASCRIPT.md     # JavaScript/Fetch examples
├── OAUTH_CURL_EXAMPLES.md         # cURL examples
└── oauth_client_python.py         # Python client library
```

## 🚀 Getting Started

### 1. Configure OAuth Providers

Update `.env` with credentials from:
- **Google**: https://console.cloud.google.com/
- **GitHub**: https://github.com/settings/developers
- **Microsoft**: https://portal.azure.com/

Minimal `.env`:
```
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

### 2. Run the App

```bash
npm run dev
```

### 3. Test Authentication

- Visit http://localhost:3000/login
- Click "Sign in with Google" (or GitHub/Microsoft)
- You'll get a JWT token on success page
- Use the token to call protected APIs

## 🔐 Protected API Routes

All require JWT token in `Authorization: Bearer <token>` header:

```bash
# Get user profile
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/profile

# Get protected data
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/protected-data

# Refresh token
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/refresh-token
```

## 📚 Client Examples

### JavaScript
```javascript
const token = localStorage.getItem('jwtToken');
const response = await fetch('/api/protected-data', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
```

### Python
```python
from oauth_client_python import OAuthClient
client = OAuthClient()
client.set_token('your-token')
profile = client.get_profile()
```

### cURL
```bash
export TOKEN="your-jwt-token"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/profile
```

## 🔄 How It Works

```
1. User clicks "Sign in with Google" → /auth/google
2. Passport redirects to Google OAuth
3. Google redirects back to → /auth/google/callback
4. Passport verifies credentials → generates JWT token
5. Server redirects to /auth-success with token in URL
6. Frontend displays token & stores in localStorage
7. Frontend uses token in Authorization header for API calls
8. Backend validates JWT & returns protected data
```

## 📝 JWT Token Format

```javascript
{
  "id": "google-123456789",
  "email": "user@example.com",
  "name": "User Name",
  "provider": "google",
  "iat": 1704067200,
  "exp": 1704153600
}
```

Expiry: 24 hours  
Secret: From `JWT_SECRET` in `.env`

## ⚙️ Configuration

### Token Expiry
Edit `src/auth/jwt.ts`:
```typescript
const JWT_EXPIRY = '24h'; // Change this
```

### Add More OAuth Providers
Edit `src/auth/passport.ts` and add new strategy:
```typescript
passport.use(new LinkedInStrategy({...}));
```

### Change Protected Routes
Edit `src/routes/index.ts`:
```typescript
router.get('/api/my-endpoint', authMiddleware, (req, res) => {
  res.json({ user: req.jwtPayload });
});
```

## 🚨 Important - Security Notes

For production, implement:
- ✅ Store JWT_SECRET securely (use environment secrets)
- ✅ Use HTTPS only (set `secure: true` in cookies)
- ✅ Replace in-memory user storage with database
- ✅ Add refresh token rotation
- ✅ Add CSRF protection
- ✅ Add rate limiting
- ✅ Log authentication attempts
- ✅ Validate user email domains
- ✅ Use httpOnly cookies for tokens

See [OAUTH_SETUP_GUIDE.md](./OAUTH_SETUP_GUIDE.md) for full security checklist.

## 🧪 Testing Endpoints

### 1. Test Login Flow
```bash
# Start app
npm run dev

# Visit login page
open http://localhost:3000/login

# Complete OAuth flow and get token
# Copy token from success page
```

### 2. Test Protected API
```bash
# With valid token
TOKEN="your-token"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/protected-data

# Without token (should fail)
curl http://localhost:3000/api/protected-data

# With invalid token (should fail)
curl -H "Authorization: Bearer invalid" \
  http://localhost:3000/api/protected-data
```

## 📖 Full Documentation

- [Complete Setup Guide](./OAUTH_SETUP_GUIDE.md)
- [JavaScript Examples](./OAUTH_CLIENT_JAVASCRIPT.md)
- [cURL Examples](./OAUTH_CURL_EXAMPLES.md)
- [Python Client](./oauth_client_python.py)

## ✨ Next Steps

1. **Configure OAuth providers** with your credentials
2. **Test the login flow** in browser
3. **Integrate into your frontend** using token from localStorage
4. **Customize protected routes** for your use cases
5. **Deploy to production** with security hardening

---

**Questions?** Check the documentation files or the example code in the project!
