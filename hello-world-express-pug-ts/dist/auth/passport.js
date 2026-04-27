"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const passport_oauth2_1 = __importDefault(require("passport-oauth2"));
// In-memory user store (replace with database in production)
const users = new Map();
exports.users = users;
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    const user = users.get(id);
    done(null, user || null);
});
// Google OAuth
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    }, (accessToken, refreshToken, profile, done) => {
        var _a, _b;
        const user = {
            id: `google-${profile.id}`,
            email: ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || '',
            name: profile.displayName,
            provider: 'google',
            profile,
        };
        users.set(user.id, user);
        done(null, user);
    }));
}
// GitHub OAuth
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport_1.default.use(new passport_github2_1.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback',
    }, (accessToken, refreshToken, profile, done) => {
        var _a, _b;
        const user = {
            id: `github-${profile.id}`,
            email: ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || profile.username,
            name: profile.displayName || profile.username,
            provider: 'github',
            profile,
        };
        users.set(user.id, user);
        done(null, user);
    }));
}
// Microsoft OAuth (Generic OAuth2)
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
    passport_1.default.use('microsoft', new passport_oauth2_1.default({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || 'http://localhost:3000/auth/microsoft/callback',
    }, (accessToken, refreshToken, profile, done) => {
        var _a, _b;
        const user = {
            id: `microsoft-${profile.id || 'unknown'}`,
            email: ((_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value) || '',
            name: profile.displayName || profile.username || 'Microsoft User',
            provider: 'microsoft',
            profile,
        };
        users.set(user.id, user);
        done(null, user);
    }));
}
