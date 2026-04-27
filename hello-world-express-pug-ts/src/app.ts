import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import './auth/passport';
import { setRoutes } from './routes/index';

const app = express();
const PORT = process.env.PORT || 3000;

// Set views directory
app.set('views', path.join(__dirname, '../src/views'));

// Set the view engine to Pug
app.set('view engine', 'pug');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
setRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});