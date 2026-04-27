import { Router, Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { generateToken, generateId } from './auth';
import { getDatabase } from './database';

const router = Router();

// Configure Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = getDatabase();
        const userId = `google-${profile.id}`;
        const email = profile.emails?.[0]?.value || '';
        const name = profile.displayName;

        // Check if user exists
        let user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

        if (!user) {
          // Create new user
          await db.run(
            'INSERT INTO users (id, email, name, provider, provider_id) VALUES (?, ?, ?, ?, ?)',
            [userId, email, name, 'google', profile.id]
          );
          user = { id: userId, email, name, provider: 'google' };
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const db = getDatabase();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    
    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth-success?token=${token}`);
  }
);

// Logout
router.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;
