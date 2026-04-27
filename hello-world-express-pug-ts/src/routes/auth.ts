import { Router, Request, Response } from 'express';
import passport from 'passport';
import { generateToken } from '../auth/jwt';

const router = Router();

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
      provider: user.provider,
    });
    res.redirect(`/auth-success?token=${token}`);
  }
);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
    });
    res.redirect(`/auth-success?token=${token}`);
  }
);

// Microsoft OAuth routes
router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] }));

router.get(
  '/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
    });
    res.redirect(`/auth-success?token=${token}`);
  }
);

// Logout
router.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) res.status(500).json({ error: 'Logout failed' });
    res.redirect('/');
  });
});

export default router;
