import {Router, Request, Response} from 'express';
import friendController from '../controllers/Friend.controller.js';

const router = Router();
router.get('/', async (req: Request, res: Response) => {
    await friendController.getAllFriends(req, res);
});
router.get('/', async (req: Request, res: Response) => {
    await friendController.getFriends(req, res);
});
router.post('/', async (req: Request, res: Response) => {
    await friendController.createFriend(req, res);
});
router.put('/', async (req: Request, res: Response) => {
    await friendController.updateFriend(req, res);
});
router.put('/accept/:reciever', async (req: Request, res: Response) => {
    await friendController.acceptFriend(req, res);
});
router.delete('/:id', async (req: Request, res: Response) => {
    await friendController.deleteFriend(req, res);
});
router.delete('/', async (req: Request, res: Response) => {
    await friendController.deleteAll(req, res);
});

export default router;