import { Router } from 'express';
import userController from '../controllers/User.controller.js';

const router = Router();

router.post('/register', async (req, res) => {
    await userController.register(req, res);
});
router.post('/login', async (req, res) => {
    await userController.login(req, res);
});
router.get('/logout', async (req, res) => {
    await userController.logout(req, res);
});
router.get('/me/:username', async (req, res) => {
    await userController.me(req, res);
});
router.get('/', async (req, res) => {
    await userController.getAll(req, res);
});
// router.get('/:id', async (req, res) => {
//     await userController.getById(req, res);
// });
// router.put('/:id', async (req, res) => {
//     await userController.update(req, res);
// });
// router.delete('/:id', async (req, res) => {
//     await userController.delete(req, res);
// });

const userRouter = router;
export default userRouter;
