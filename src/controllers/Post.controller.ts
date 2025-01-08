import { Response, Request } from 'express';
import postService from '../services/Post.service.js';
import { IPost } from '../repositories/models/posts.js';
import { Types } from 'mongoose';

class Post {
    createPost = async (req: Request, res: Response) => {
        const userId = new Types.ObjectId(req.user);
        const { 
            content,
            habitId,
            likes,
            likeCount,
            status,
            isDeleted } = req.body;
        const postData : Partial<IPost>= {
            content,
            habitId,
            userId,
            likes,
            likeCount,
            status,
            isDeleted
        };
        const post = await postService.create(postData);
        if (!post.status) {
            return res.status(400).json(post);
        }
        return res.status(201).json(post);
    }
    getPostByUser = async (req: Request, res: Response) => {
        const {page, pageSize} = req.query;
        const posts = await postService.getPostByUser(req.user, Number(page), Number(pageSize));
        if (!posts.status) {
            return res.status(400).json(posts);
        }
        if (!posts.status && posts.data.length === 0) {
            return res.status(404).json(posts);
        }
        return res.status(200).json(posts);
    };
    getPostById = async (req: Request, res: Response) => {
        const { postId } = req.params;
        const post = await postService.getPostById(postId);
        if (!post.status) {
            return res.status(404).json(post);
        }
        return res.status(200).json(post);
    };
    manageLike = async (req: Request, res: Response) => {
        const { postId } = req.params;
        const post = await postService.manageLike(postId, req.user);
        if (!post.status) {
            return res.status(404).json(post);
        }
        return res.status(200).json(post);
    }
    deletePost = async (req: Request, res: Response) => {
        const { postId } = req.params;
        const post = await postService.deletePost(postId);
        if (!post.status) {
            return res.status(404).json(post);
        }
        return res.status(200).json(post);
    }
    updatePost = async (req: Request, res: Response) => {
        const { postId } = req.params;
        const post = await postService.updatePost(postId, req.body);
        if (!post.status) {
            return res.status(404).json(post);
        }
        return res.status(200).json(post);
    }
}

const postController = new Post();
export default postController;
