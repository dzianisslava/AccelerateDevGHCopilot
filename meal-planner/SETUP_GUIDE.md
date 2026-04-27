# Meal Planner - Complete Setup Guide

## Project Structure

```
meal-planner/
├── server/                 # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts       # Main server file
│   │   ├── database.ts    # SQLite database setup
│   │   ├── auth.ts        # JWT utilities
│   │   ├── middleware.ts  # Authentication middleware
│   │   └── routes/
│   │       ├── auth.ts    # OAuth routes
│   │       ├── meals.ts   # Meal CRUD routes
│   │       └── meal-plans.ts  # Meal plan routes
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── client/                # React frontend
    ├── src/
    │   ├── api.ts         # API client & interceptors
    │   ├── sharing.ts     # Social media sharing
    │   ├── types.ts       # TypeScript types
    │   ├── App.tsx        # Main app component
    │   ├── index.tsx      # React entry point
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   ├── AuthSuccess.tsx
    │   │   ├── Meals.tsx
    │   │   └── MealPlan.tsx
    │   ├── components/
    │   │   ├── Navigation.tsx
    │   │   ├── MealCard.tsx
    │   │   └── CreateMealModal.tsx
    │   └── **/*.css       # Styling
    ├── public/
    │   └── index.html
    ├── package.json
    ├── tsconfig.json
    └── .env
```

## Setup Instructions

### 1. Backend Setup

```bash
cd meal-planner/server

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Configure your .env with Google OAuth credentials
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - JWT_SECRET (generate a random string)
# - SESSION_SECRET (generate a random string)

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
cd meal-planner/client

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will open at `http://localhost:3000`

## Features

### 🔐 Authentication
- Google OAuth 2.0 integration
- JWT token-based authentication
- Secure token storage in localStorage
- Protected routes with automatic redirects

### 🍽️ Meal Management
- Create, read, update, and delete meals
- Add ingredients, prep/cook times, servings
- Upload meal images via URL
- Tag meals for easy filtering
- Search meals and filter by tags

### 📅 Weekly Meal Planning
- Drag-and-drop meal assignment to calendar
- 7-day week view with 4 meal types per day
- Quick meal selection modal
- Remove meals from plan

### 📱 Social Media Sharing
- Share meals on Twitter
- Share meals on Facebook
- Pin meals to Pinterest
- Shareable meal plan links

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - Logout user

### Meals
- `GET /api/meals` - Get all meals for user
- `POST /api/meals` - Create new meal
- `GET /api/meals/:id` - Get meal details
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Meal Plans
- `GET /api/meal-plans/week/:weekStart` - Get weekly plan
- `POST /api/meal-plans/:planId/items` - Add meal to plan
- `DELETE /api/meal-plans/items/:itemId` - Remove meal from plan

## Database Schema

### users
- id (TEXT, PRIMARY KEY)
- email (TEXT, UNIQUE)
- name (TEXT)
- provider (TEXT)
- provider_id (TEXT)
- created_at (DATETIME)

### meals
- id (TEXT, PRIMARY KEY)
- user_id (TEXT, FOREIGN KEY)
- name (TEXT)
- description (TEXT)
- ingredients (JSON)
- prep_time (INTEGER)
- cook_time (INTEGER)
- servings (INTEGER)
- image_url (TEXT)
- tags (JSON)
- created_at (DATETIME)

### meal_plans
- id (TEXT, PRIMARY KEY)
- user_id (TEXT, FOREIGN KEY)
- week_start (DATE)
- created_at (DATETIME)

### meal_plan_items
- id (TEXT, PRIMARY KEY)
- meal_plan_id (TEXT, FOREIGN KEY)
- meal_id (TEXT, FOREIGN KEY)
- day_of_week (INTEGER)
- meal_type (TEXT)
- created_at (DATETIME)

## Environment Variables

### Server (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - SQLite database path
- `FRONTEND_URL` - Frontend URL for CORS
- `JWT_SECRET` - Secret for JWT tokens
- `JWT_EXPIRY` - JWT expiration time (default: 7d)
- `SESSION_SECRET` - Secret for sessions
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_CALLBACK_URL` - Google OAuth callback URL

### Client (.env)
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000)

## Development

### Start both servers

Terminal 1 (Backend):
```bash
cd meal-planner/server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd meal-planner/client
npm start
```

### Build for production

Backend:
```bash
npm run build
npm start
```

Frontend:
```bash
npm run build
```

## Troubleshooting

### CORS Errors
Make sure `FRONTEND_URL` in backend .env matches your frontend URL

### OAuth Redirect Issues
Ensure `GOOGLE_CALLBACK_URL` matches your Google OAuth configuration

### Database Errors
Check that `DATABASE_URL` path is writable and has proper permissions

### Token Expiration
If receiving "Invalid or expired token", user needs to log in again

## Security Considerations

- Change `JWT_SECRET` and `SESSION_SECRET` before production
- Use HTTPS in production
- Set `NODE_ENV=production` in backend
- Use environment-specific Google OAuth credentials
- Never commit .env files to version control
