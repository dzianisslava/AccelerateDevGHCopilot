import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import OAuth2Strategy from 'passport-oauth2';
import { JWTPayload, generateToken } from './jwt';

// In-memory user store (replace with database in production)
const users: Map<string, any> = new Map();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  const user = users.get(id);
  done(null, user || null);
});

// Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
      },
      (accessToken: any, refreshToken: any, profile: any, done: any) => {
        const user = {
          id: `google-${profile.id}`,
          email: profile.emails?.[0]?.value || '',
          name: profile.displayName,
          provider: 'google',
          profile,
        };
        users.set(user.id, user);
        done(null, user);
      }
    )
  );
}

// GitHub OAuth
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback',
      },
      (accessToken: any, refreshToken: any, profile: any, done: any) => {
        const user = {
          id: `github-${profile.id}`,
          email: profile.emails?.[0]?.value || profile.username,
          name: profile.displayName || profile.username,
          provider: 'github',
          profile,
        };
        users.set(user.id, user);
        done(null, user);
      }
    )
  );
}

// Microsoft OAuth (Generic OAuth2)
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  passport.use(
    'microsoft',
    new OAuth2Strategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:3000/auth/microsoft/callback',
      },
      (accessToken: any, refreshToken: any, profile: any, done: any) => {
        const user = {
          id: `microsoft-${profile.id || 'unknown'}`,
          email: profile.emails?.[0]?.value || '',
          name: profile.displayName || profile.username || 'Microsoft User',
          provider: 'microsoft',
          profile,
        };
        users.set(user.id, user);
        done(null, user);
      }
    )
  );
}

export { users };
