# OAuth2 + JWT API Usage Examples with cURL

## 1. OAuth Login Flow

# Option 1: Open in browser (or redirect user)
http://localhost:3000/auth/google
http://localhost:3000/auth/github
http://localhost:3000/auth/microsoft

# User will be redirected to auth-success page with JWT token

## 2. Using JWT Token with Protected APIs

# Set your token (from auth-success page)
export TOKEN="your-jwt-token-here"

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

## 3. Error Examples

# Without token (401 Unauthorized)
curl http://localhost:3000/api/profile

# With invalid token
curl -H "Authorization: Bearer invalid-token" \
  http://localhost:3000/api/profile

# With expired token
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImdvIiwiaWF0IjoxNjAwMDAwMDAwfQ.invalid" \
  http://localhost:3000/api/profile

## 4. With Additional Options

# Pretty print JSON
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/profile | jq

# Save response to file
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/protected-data > response.json

# Include response headers
curl -i -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/profile

## 5. Logout

curl http://localhost:3000/auth/logout
