# OAuth2 + JWT Authentication System

Complete OAuth2 and JWT authentication for your Express/TypeScript app with support for Google, GitHub, and Microsoft OAuth providers.

## Features

✅ OAuth2 authentication with Google, GitHub, Microsoft  
✅ JWT token generation and validation  
✅ Protected API routes with JWT middleware  
✅ Session management  
✅ Token refresh capability  
✅ Example clients in JavaScript and Python  

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your OAuth credentials:

```bash
cp .env.example .env
```

### 3. Configure OAuth Providers

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add `http://localhost:3000/auth/google/callback` as authorized redirect URI
6. Copy Client ID and Client Secret to `.env`

#### GitHub OAuth Setup
1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Create New OAuth App
3. Set Authorization callback URL to `http://localhost:3000/auth/github/callback`
4. Copy Client ID and Client Secret to `.env`

#### Microsoft OAuth Setup
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Add `http://localhost:3000/auth/microsoft/callback` as redirect URI
4. Copy Client ID and Client Secret to `.env`

### 4. Run the Application

```bash
npm run dev
```

### 5. Access the Application

- **Login Page**: http://localhost:3000/login
- **Home Page**: http://localhost:3000
- **Protected APIs**: Require JWT token in Authorization header

## API Endpoints

### Authentication Routes

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/microsoft` - Initiate Microsoft OAuth
- `GET /auth/logout` - Logout and clear session

### Protected API Routes (Require JWT Token)

```bash
# Get user profile
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/profile

# Get protected data
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/protected-data

# Refresh token
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/refresh-token
```

## JWT Token Structure

The JWT token contains:
- `id` - User ID (provider-prefixed, e.g., "google-123456")
- `email` - User email
- `name` - User display name
- `provider` - OAuth provider (google, github, microsoft)
- `iat` - Issued at timestamp
- `exp` - Expiration timestamp (24 hours)

## Code Examples

### JavaScript/Fetch

See [OAUTH_CLIENT_JAVASCRIPT.md](./OAUTH_CLIENT_JAVASCRIPT.md) for complete examples:

```javascript
const token = localStorage.getItem('jwtToken');
const response = await fetch('http://localhost:3000/api/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
```

### Python

See `oauth_client_python.py` for complete examples:

```python
from oauth_client_python import OAuthClient

client = OAuthClient()
client.set_token('your-jwt-token')
profile = client.get_profile()
print(profile)
```

### cURL

See [OAUTH_CURL_EXAMPLES.md](./OAUTH_CURL_EXAMPLES.md) for complete examples:

```bash
export TOKEN="your-jwt-token"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/profile
```

## Project Structure

```
src/
├── auth/
│   ├── jwt.ts           # JWT token generation and verification
│   └── passport.ts      # Passport.js OAuth strategies
├── middleware/
│   └── auth.ts          # JWT validation middleware
├── routes/
│   ├── index.ts         # Main routes
│   └── auth.ts          # OAuth routes
├── views/
│   ├── index.pug        # Home page
│   ├── login.pug        # Login page
│   └── auth-success.pug # Success page (shows token)
└── app.ts               # Express app setup
```

## Security Considerations

⚠️ **Important for Production:**

1. **Change JWT_SECRET** in `.env` to a strong random value
2. **Use HTTPS** - Set `secure: true` in session cookie config
3. **Replace in-memory user storage** with a real database
4. **Implement refresh token rotation** - Use database to store refresh tokens
5. **Add CSRF protection** - Use `csurf` middleware
6. **Add rate limiting** - Use `express-rate-limit`
7. **Validate email domains** - Restrict to organizational domains
8. **Store tokens securely** - Use httpOnly cookies instead of localStorage
9. **Implement token expiration** - Add refresh token with longer expiry
10. **Monitor suspicious activity** - Log authentication attempts

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3000) |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `SESSION_SECRET` | Yes | Secret key for session |
| `GOOGLE_CLIENT_ID` | No | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth Client Secret |
| `GOOGLE_CALLBACK_URL` | No | Google OAuth Callback URL |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth Client Secret |
| `GITHUB_CALLBACK_URL` | No | GitHub OAuth Callback URL |
| `MICROSOFT_CLIENT_ID` | No | Microsoft OAuth Client ID |
| `MICROSOFT_CLIENT_SECRET` | No | Microsoft OAuth Client Secret |
| `MICROSOFT_CALLBACK_URL` | No | Microsoft OAuth Callback URL |

## Troubleshooting

### Token appears invalid
- Check JWT_SECRET in .env matches
- Verify token hasn't expired (24 hour default)
- Check Authorization header format: `Bearer <token>`

### OAuth login redirects to localhost
- Ensure callback URLs in .env match OAuth provider configuration
- For production, update callback URLs to your domain

### Cannot find module errors
- Run `npm install` to install all dependencies
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### CORS errors
- Configure CORS if frontend is on different origin:
  ```javascript
  import cors from 'cors';
  app.use(cors());
  ```

## Next Steps

1. Implement database user storage (MongoDB, PostgreSQL, etc.)
2. Add refresh token rotation
3. Implement role-based access control (RBAC)
4. Add email verification
5. Setup production deployment
6. Add logging and monitoring

## References

- [Passport.js Documentation](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
- [OAuth 2.0](https://oauth.net/2/)
- [Express.js](https://expressjs.com/)
