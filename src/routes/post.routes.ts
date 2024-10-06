import {Router, Response, Request} from 'express';
import postController from '../controllers/PostController.js';
const router = Router();

router.post('/', async (req: Request, res: Response) => {
    await postController.createPost(req, res);
});
router.get('/user', async (req: Request, res: Response) => {
    await postController.getPostByUser(req, res);
});
router.get('/:postId', async (req: Request, res: Response) => {
    await postController.getPostById(req, res);
});
router.put('/:postId', async (req: Request, res: Response) => {
    await postController.updatePost(req, res);
});
router.delete('/:postId', async (req: Request, res: Response) => {
    await postController.deletePost(req, res);
});
router.put('/:postId/like', async (req: Request, res: Response) => {
    await postController.manageLike(req, res);
});

export default router;