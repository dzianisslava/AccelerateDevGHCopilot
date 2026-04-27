# 🍽️ Meal Planner - Full-Stack React + Node.js App

A complete meal planning web application with OAuth authentication, meal management, weekly planning, and social media sharing features.

## 🎯 Features

### Authentication & Security
- ✅ Google OAuth 2.0 integration
- ✅ JWT token-based authentication (7-day expiry)
- ✅ Secure session management
- ✅ Protected routes with automatic redirects

### Meal Management
- ✅ Create, read, update, delete meals
- ✅ Store meal details: ingredients, prep/cook times, servings
- ✅ Upload meal images via URL
- ✅ Tag meals for filtering
- ✅ Full-text search meals and tags

### Weekly Planning
- ✅ Interactive 7-day meal calendar
- ✅ 4 meal types per day (Breakfast, Lunch, Dinner, Snack)
- ✅ Drag-select meals to calendar
- ✅ Remove meals with one click
- ✅ Navigate between weeks

### Social Sharing
- ✅ Share meals on Twitter
- ✅ Share on Facebook
- ✅ Pin to Pinterest
- ✅ Shareable meal plan links
- ✅ Beautiful share buttons

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ & npm
- Google OAuth credentials
- Terminal/Command Prompt

### 1. Backend Setup

```bash
cd meal-planner/server
npm install
cp .env.example .env

# Add your Google OAuth credentials to .env:
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...

npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd meal-planner/client
npm install
npm start
# App opens at http://localhost:3000
```

### 3. Login & Start Planning
1. Click "Sign in with Google"
2. Create your first meal
3. Add meals to your weekly plan
4. Share with friends!

## 📁 Project Structure

```
meal-planner/
├── server/                    # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts          # Main server & routes
│   │   ├── database.ts       # SQLite initialization
│   │   ├── auth.ts           # JWT utilities
│   │   ├── middleware.ts     # Auth middleware
│   │   └── routes/
│   │       ├── auth.ts       # OAuth callbacks
│   │       ├── meals.ts      # Meal CRUD
│   │       └── meal-plans.ts # Weekly plans
│   ├── data/                 # SQLite database
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── client/                    # React frontend
    ├── src/
    │   ├── pages/            # Page components
    │   ├── components/       # Reusable components
    │   ├── api.ts            # API client
    │   ├── sharing.ts        # Social sharing
    │   ├── types.ts          # TypeScript types
    │   └── **/*.css          # Styles
    ├── public/
    ├── package.json
    └── .env
```

## 🔌 API Endpoints

### Authentication
- `GET /auth/google` - Start Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - Logout

### Meals (requires auth token)
- `GET /api/meals` - Get all user meals
- `POST /api/meals` - Create meal
- `GET /api/meals/:id` - Get meal details
- `PUT /api/meals/:id` - Update meal
- `DELETE /api/meals/:id` - Delete meal

### Meal Plans (requires auth token)
- `GET /api/meal-plans/week/:weekStart` - Get weekly plan
- `POST /api/meal-plans/:planId/items` - Add meal to plan
- `DELETE /api/meal-plans/items/:itemId` - Remove meal from plan

## 🗄️ Database Schema

**users** - User profiles from OAuth
- id, email, name, provider, created_at

**meals** - User-created recipes
- id, user_id, name, description, ingredients (JSON), prep_time, cook_time, servings, image_url, tags (JSON)

**meal_plans** - Weekly plans
- id, user_id, week_start, created_at

**meal_plan_items** - Assigned meals
- id, meal_plan_id, meal_id, day_of_week, meal_type

## ⚙️ Configuration

### Backend (.env)
```
PORT=5000
JWT_SECRET=your-random-secret-key
SESSION_SECRET=your-random-session-secret
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## 🛠️ Development Commands

### Backend
```bash
npm run dev      # Start with auto-reload
npm run build    # Compile TypeScript
npm start        # Run compiled app
```

### Frontend
```bash
npm start        # Start dev server
npm build        # Create production build
npm test         # Run tests
```

## 🔐 Security Notes

- Secrets are stored in `.env` files (never commit these)
- JWT tokens expire after 7 days
- CORS is configured for localhost development
- Passwords are never stored (OAuth only)

## 📱 Supported Browsers

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 🚀 Production Deployment

Before deploying:

1. Change all secrets in .env
2. Set `NODE_ENV=production`
3. Use HTTPS URLs
4. Set up proper CORS origins
5. Use a managed database (PostgreSQL recommended)
6. Deploy backend and frontend separately
7. Configure OAuth callback URLs

## 📞 Support

For issues or questions, check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed troubleshooting.

## 📄 License

MIT

---

**Happy meal planning! 🍽️✨**
