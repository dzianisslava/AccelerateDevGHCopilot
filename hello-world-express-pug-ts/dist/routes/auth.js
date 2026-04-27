"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const jwt_1 = require("../auth/jwt");
const router = (0, express_1.Router)();
// Google OAuth routes
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const user = req.user;
    const token = (0, jwt_1.generateToken)({
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
    });
    res.redirect(`/auth-success?token=${token}`);
});
// GitHub OAuth routes
router.get('/github', passport_1.default.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport_1.default.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    const user = req.user;
    const token = (0, jwt_1.generateToken)({
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
    });
    res.redirect(`/auth-success?token=${token}`);
});
// Microsoft OAuth routes
router.get('/microsoft', passport_1.default.authenticate('microsoft', { scope: ['user.read'] }));
router.get('/microsoft/callback', passport_1.default.authenticate('microsoft', { failureRedirect: '/login' }), (req, res) => {
    const user = req.user;
    const token = (0, jwt_1.generateToken)({
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
    });
    res.redirect(`/auth-success?token=${token}`);
});
// Logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err)
            res.status(500).json({ error: 'Logout failed' });
        res.redirect('/');
    });
});
exports.default = router;
