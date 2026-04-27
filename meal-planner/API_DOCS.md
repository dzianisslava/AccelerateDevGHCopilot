# Meal Planner - API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

Get a token by:
1. Calling `GET /auth/google` to start OAuth flow
2. Completing Google sign-in
3. Receiving token in redirect: `/auth-success?token=<JWT_TOKEN>`

## Endpoints

### Auth Routes

#### Initiate Google OAuth
```
GET /auth/google
```
Redirects to Google sign-in flow

**Response:** Redirects to Google OAuth consent screen

---

#### Google OAuth Callback
```
GET /auth/google/callback
```
Google OAuth callback handler

**Response:**
```
Redirect to: /auth-success?token=<JWT_TOKEN>
```

---

#### Logout
```
GET /auth/logout
```
Clear session

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### Meal Routes

#### Get All Meals
```
GET /api/meals
```
Get all meals for authenticated user

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**
```json
[
  {
    "id": "1234567890-abc123",
    "name": "Spaghetti Carbonara",
    "description": "Classic Italian pasta",
    "ingredients": ["Pasta", "Eggs", "Bacon", "Parmesan"],
    "prep_time": 10,
    "cook_time": 20,
    "servings": 4,
    "image_url": "https://...",
    "tags": ["italian", "pasta", "dinner"],
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

#### Create Meal
```
POST /api/meals
```
Create a new meal

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Spaghetti Carbonara",
  "description": "Classic Italian pasta",
  "ingredients": ["Pasta", "Eggs", "Bacon", "Parmesan"],
  "prep_time": 10,
  "cook_time": 20,
  "servings": 4,
  "image_url": "https://...",
  "tags": ["italian", "pasta", "dinner"]
}
```

**Response (201):**
```json
{
  "id": "1234567890-abc123",
  "message": "Meal created successfully"
}
```

---

#### Get Meal by ID
```
GET /api/meals/:id
```
Get specific meal details

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id` (string) - Meal ID

**Response (200):**
```json
{
  "id": "1234567890-abc123",
  "name": "Spaghetti Carbonara",
  "description": "Classic Italian pasta",
  "ingredients": ["Pasta", "Eggs", "Bacon", "Parmesan"],
  "prep_time": 10,
  "cook_time": 20,
  "servings": 4,
  "image_url": "https://...",
  "tags": ["italian", "pasta", "dinner"],
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Response (404):**
```json
{
  "error": "Meal not found"
}
```

---

#### Update Meal
```
PUT /api/meals/:id
```
Update an existing meal

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Parameters:**
- `id` (string) - Meal ID

**Request Body:**
```json
{
  "name": "Updated name",
  "description": "Updated description",
  "ingredients": ["Updated", "Ingredients"],
  "prep_time": 15,
  "cook_time": 25,
  "servings": 6,
  "image_url": "https://...",
  "tags": ["updated", "tags"]
}
```

**Response (200):**
```json
{
  "message": "Meal updated successfully"
}
```

---

#### Delete Meal
```
DELETE /api/meals/:id
```
Delete a meal

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `id` (string) - Meal ID

**Response (200):**
```json
{
  "message": "Meal deleted successfully"
}
```

---

### Meal Plan Routes

#### Get Weekly Meal Plan
```
GET /api/meal-plans/week/:weekStart
```
Get or create meal plan for a specific week

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `weekStart` (string) - Week start date in format `yyyy-MM-dd`

**Response (200):**
```json
{
  "id": "plan-1234567890",
  "user_id": "google-user123",
  "week_start": "2024-01-15",
  "created_at": "2024-01-15T10:30:00Z",
  "items": [
    {
      "id": "item-1",
      "meal_plan_id": "plan-1234567890",
      "meal_id": "meal-1",
      "day_of_week": 0,
      "meal_type": "Breakfast",
      "name": "Pancakes",
      "image_url": "https://...",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### Add Meal to Plan
```
POST /api/meal-plans/:planId/items
```
Add a meal to a specific slot in the meal plan

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Parameters:**
- `planId` (string) - Meal plan ID

**Request Body:**
```json
{
  "meal_id": "meal-1234567890",
  "day_of_week": 0,
  "meal_type": "Breakfast"
}
```

**Fields:**
- `meal_id` (string) - ID of meal to add
- `day_of_week` (number) - Day of week (0=Monday, 6=Sunday)
- `meal_type` (string) - "Breakfast", "Lunch", "Dinner", or "Snack"

**Response (201):**
```json
{
  "id": "item-1",
  "message": "Meal added to plan"
}
```

---

#### Remove Meal from Plan
```
DELETE /api/meal-plans/items/:itemId
```
Remove a meal from a meal plan slot

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Parameters:**
- `itemId` (string) - Meal plan item ID

**Response (200):**
```json
{
  "message": "Meal removed from plan"
}
```

---

## Error Responses

### Unauthorized (401)
```json
{
  "error": "Missing authorization token"
}
```

### Invalid Token (401)
```json
{
  "error": "Invalid or expired token"
}
```

### Not Found (404)
```json
{
  "error": "Meal not found"
}
```

### Server Error (500)
```json
{
  "error": "Failed to [operation]"
}
```

---

## Example Requests

### Using cURL

#### Create a meal
```bash
curl -X POST http://localhost:5000/api/meals \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grilled Chicken",
    "description": "Healthy grilled chicken breast",
    "ingredients": ["Chicken breast", "Olive oil", "Garlic"],
    "prep_time": 10,
    "cook_time": 15,
    "servings": 2,
    "tags": ["healthy", "protein", "quick"]
  }'
```

#### Get all meals
```bash
curl -X GET http://localhost:5000/api/meals \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Add meal to plan
```bash
curl -X POST http://localhost:5000/api/meal-plans/plan-123/items \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "meal_id": "meal-456",
    "day_of_week": 0,
    "meal_type": "Breakfast"
  }'
```

### Using JavaScript/Fetch

```javascript
// Get all meals
const response = await fetch('http://localhost:5000/api/meals', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const meals = await response.json();

// Create meal
const newMeal = await fetch('http://localhost:5000/api/meals', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Pasta',
    ingredients: ['Pasta', 'Tomato sauce'],
    prep_time: 5,
    cook_time: 20,
    servings: 4
  })
});
```

---

## Rate Limiting

Currently no rate limiting is implemented. In production, add rate limiting middleware to prevent abuse.

## CORS

CORS is enabled for the frontend URL specified in `.env` (default: `http://localhost:3000`)

## Token Expiration

JWT tokens expire after 7 days (configurable via `JWT_EXPIRY` in .env)

When a token expires, user must log in again via OAuth.

---

For more details, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
