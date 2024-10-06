import PostModel, { IPost } from "./models/posts.js";
import { NullExpression, Types } from 'mongoose';

class Post {
    create = async (data: Partial<IPost>) => {
        const post = new PostModel(data);
        const newPost = await post.save();
        if(!newPost){
            return null;
        }
        return newPost;
    }
    find = async (query: any, pageSize: number, page: number, sort?: any) : Promise<IPost[]> => {
        let queryBuilder = PostModel.find({ ...query, isDeleted: false })
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        if (sort) {
            queryBuilder = queryBuilder.sort(sort);
        }
        const posts = await queryBuilder.populate('habitId').exec();
        if (!posts) {
            return [];
        }
        return posts;
    }
    findById = async (id: string) => {
        const post = await PostModel.findById(id);
        if(!post){
            return null;
        }
        return post;
    }
    findAll = async (page: number, pageSize: number) : Promise<IPost[]| NullExpression>  => {
        const posts = await PostModel.find({}).skip((page - 1) * pageSize).limit(pageSize);
        if(!posts){
            return [];
        }
        return posts;
    }
    update = async (id: string, data: any) => {
        const post = await PostModel.findByIdAndUpdate(id, {...data, isDeleted: false}, {new: true});
        if(!post){
            return null;
        }
        return post;
    }
    delete = async (id: string) => {
        const post = await PostModel.findById(id);
        if(!post){
            return null;
        }
        post.isDeleted = true;
        const newPost = await post.save();
        return newPost;
    }
}

const postRepository = new Post();
export default postRepository;