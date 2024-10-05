import { Router, Response, Request } from "express";
import subhabitController from "../controllers/Subhabit.controller.js";

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    await subhabitController.create(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
    await subhabitController.update(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
    await subhabitController.delete(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
    await subhabitController.get(req, res);
});

router.get('/:id/habit/:id', async (req: Request, res: Response) => {
    await subhabitController.getByHabit(req, res);
});

export default router;