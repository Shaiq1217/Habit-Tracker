import { Router, Response, Request, NextFunction } from "express";
import habitsRouter  from "./habits.routes.js";
import errorHandler from "../common/error.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use('/api/habits', habitsRouter);
router.use('/api/user', userRoutes)
router.use(errorHandler);

export default router;