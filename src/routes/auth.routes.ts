import {Router, Request, Response} from 'express';
import authController from '../controllers/Auth.controller.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    await authController.register(req, res);
});

router.post('/login', async (req: Request, res: Response) => {
    await authController.login(req, res);
});

router.post('/forgot-password', async (req: Request, res: Response) => {
    await authController.forgotPassword(req, res);
});

router.post('/reset-password', async (req: Request, res: Response) => {
    await authController.resetPassword(req, res);
});

router.post('/verify-email', async (req: Request, res: Response) => {
    await authController.verifyEmail(req, res);
});
export default router;