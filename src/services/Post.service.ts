import { Types, isValidObjectId } from 'mongoose';
import { IResponse } from '../common/types/shared';
import postRepository from '../repositories/Post.repository.js';
import { IPost } from '../repositories/models/posts.js';
import habitService from './Habit.service.js';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../common/constants.js';

class Post {
  deletePost = async(postId: string) => {
    if(!isValidObjectId(postId)) {
      return { status: false, message: 'Invalid post ID' };
    }
    if(await this.getPostById(postId)) {
      return { status: false, message: 'Post not found' };
    }
    const post = await postRepository.delete(postId);
    if (!post) {
      return { status: false, message: 'Post not deleted' };
    }
    return { status: true, message: 'Post deleted', data: post };
  }
  create = async (data: Partial<IPost>): Promise<IResponse<IPost>> => {
    const habitExists = await this.checkHabitExist(data.habitId.toString())
    if (!habitExists) {
      return { status: false, message: 'Habit not found' };
    }
    const post = await postRepository.create(data);
    if (!post) {
      return { status: false, message: 'Post not created' };
    }
    return { status: true, message: 'Post created', data: post };
  };

  getPostById = async (postId: string): Promise<IResponse<IPost>> => {
    if(!isValidObjectId(postId)) {
      return { status: false, message: 'Invalid post ID' };
    }
    const post = await postRepository.findById(postId);
    if (!post) {
      return { status: false, message: 'Post not found' };
    }
    return { status: true, message: 'Post found', data: post };
  };

  getPostByUser = async (userId: string, page: number = DEFAULT_PAGE, pageSize: number = DEFAULT_LIMIT): Promise<IResponse<IPost[]>> => {

    const posts = await postRepository.find({ userId: userId }, page, pageSize);
    if (!posts) {
      return { status: false, message: 'Post not found' };
    }
    return { status: true, message: 'Post found', data: posts };
  };

  manageLike = async (postId: string, userId: string): Promise<IResponse<IPost>> => {

    const post = await postRepository.findById(postId);
    if (!post) {
      return { status: false, message: 'Post not found' };
    }
    const userObjectId = new Types.ObjectId(userId);
    const index = post.likes.indexOf(userObjectId);
    if (index === -1) {
      post.likes.push(userObjectId);
    } else {
      post.likes.splice(index, 1);
    }
    post.likeCount = post.likes.length;
    const updatedPost = await postRepository.update(postId, post);
    if (!updatedPost) {
      return { status: false, message: 'Failed to update post' };
    }
    return { status: true, message: 'Post updated', data: updatedPost };
  };

  updatePost = async (postId: string, data: Partial<IPost>): Promise<IResponse<IPost>> => {
    if(!isValidObjectId(postId)) {
      return { status: false, message: 'Invalid post ID' };
    }
    const post = await postRepository.update(postId, data);
    if (!post) {
      return { status: false, message: 'Post not updated' };
    }
    return { status: true, message: 'Post updated', data: post };
  };

  checkHabitExist = async (id: string): Promise<boolean> => {
    return (await habitService.get(id)).status;
  };
}

const postService = new Post();
export default postService;
