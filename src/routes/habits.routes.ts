import { Router, Request, Response } from 'express';
import habitController from '../controllers/Habits.controller.js';

const router = Router();

router.get('/:id', async (req: Request, res: Response) => { 
    await habitController.getHabitById(req, res);
}); 
router.get('/', async (req: Request, res: Response) => {
    await habitController.getHabits(req, res);
});
router.post('/', async (req: Request, res: Response) => {
    await habitController.createHabit(req, res);
});
router.put('/:id', async (req: Request, res: Response) => {
    await habitController.updateHabit(req, res);
});
router.delete('/:id', async (req: Request, res: Response) => {
    await habitController.deleteHabit(req, res);
});
router.delete('/', async (req: Request, res: Response) => {
    await habitController.deleteAll(req, res);
});
export default router;
