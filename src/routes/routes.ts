import { Router, Response, Request, NextFunction } from "express";
import habitsRoutes  from "./habits.routes.js";
import errorHandler from "../common/error.js";
import userRoutes from "./user.routes.js";
import friendRoutes from "./friend.routes.js";
import authRoutes from "./auth.routes.js";
import subhabitRoutes from "./subhabit.routes.js";
import { ensureAuth } from "../middleware/authentication.js";
import postRoutes from "./post.routes.js";
const router = Router();

router.use('/api/habits',ensureAuth, habitsRoutes);
router.use('/api/subhabit',ensureAuth,subhabitRoutes);
router.use('/api/user',ensureAuth, userRoutes);
router.use('/api/friends',ensureAuth, friendRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/post',ensureAuth, postRoutes);

router.use(errorHandler);

export default router;