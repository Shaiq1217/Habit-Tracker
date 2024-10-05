import { Router, Response, Request, NextFunction } from "express";
import habitsRoutes  from "./habits.routes.js";
import errorHandler from "../common/error.js";
import userRoutes from "./user.routes.js";
import friendRoutes from "./friend.routes.js";
// import authRoutes from "./auth.routes.js";
// import subhabitRoutes from "./subhabit.routes.js";
const router = Router();

router.use('/api/habits', habitsRoutes);
// router.use('/api/subhabit', subhabitRoutes);
router.use('/api/user', userRoutes);
router.use('/api/friends', friendRoutes);
// router.use('/api/auth', authRoutes);

router.use(errorHandler);

export default router;