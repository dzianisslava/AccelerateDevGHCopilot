import { Router, Request, Response } from 'express';
import authRouter from './auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

export function setRoutes(app: any) {
    // Public routes
    router.get('/', (req: Request, res: Response) => {
        res.render('index', { title: 'Hello World' });
    });

    // Login page
    router.get('/login', (req: Request, res: Response) => {
        res.render('login', { title: 'Login' });
    });

    // Auth success page (shows token)
    router.get('/auth-success', (req: Request, res: Response) => {
        const token = req.query.token as string;
        res.render('auth-success', { title: 'Login Successful', token });
    });

    // Protected API endpoints (require JWT)
    router.get('/api/profile', authMiddleware, (req: Request, res: Response) => {
        res.json({
            message: 'This is a protected route',
            user: req.jwtPayload,
        });
    });

    router.post('/api/refresh-token', authMiddleware, (req: Request, res: Response) => {
        // In real implementation, verify refresh token
        res.json({
            message: 'Token refresh endpoint',
            note: 'Implement refresh token logic here',
        });
    });

    router.get('/api/protected-data', authMiddleware, (req: Request, res: Response) => {
        res.json({
            data: 'This is protected data only accessible with a valid JWT',
            user: req.jwtPayload,
            timestamp: new Date().toISOString(),
        });
    });

    // Mount auth routes
    app.use('/auth', authRouter);
    app.use('/', router);
}