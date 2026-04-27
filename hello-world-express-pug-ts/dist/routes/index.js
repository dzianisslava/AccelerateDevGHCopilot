"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
function setRoutes(app) {
    // Public routes
    router.get('/', (req, res) => {
        res.render('index', { title: 'Hello World' });
    });
    // Login page
    router.get('/login', (req, res) => {
        res.render('login', { title: 'Login' });
    });
    // Auth success page (shows token)
    router.get('/auth-success', (req, res) => {
        const token = req.query.token;
        res.render('auth-success', { title: 'Login Successful', token });
    });
    // Protected API endpoints (require JWT)
    router.get('/api/profile', auth_2.authMiddleware, (req, res) => {
        res.json({
            message: 'This is a protected route',
            user: req.jwtPayload,
        });
    });
    router.post('/api/refresh-token', auth_2.authMiddleware, (req, res) => {
        // In real implementation, verify refresh token
        res.json({
            message: 'Token refresh endpoint',
            note: 'Implement refresh token logic here',
        });
    });
    router.get('/api/protected-data', auth_2.authMiddleware, (req, res) => {
        res.json({
            data: 'This is protected data only accessible with a valid JWT',
            user: req.jwtPayload,
            timestamp: new Date().toISOString(),
        });
    });
    // Mount auth routes
    app.use('/auth', auth_1.default);
    app.use('/', router);
}
exports.setRoutes = setRoutes;
