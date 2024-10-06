import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPost extends Document {
  content: string;
  habitId: Types.ObjectId;
  userId: Types.ObjectId;
  likes?: Types.ObjectId[];
  likeCount?: number;
  status?: 'published' | 'draft';
  isDeleted?: boolean;
}

const Post: Schema = new Schema(
  {
    content: { type: String, required: true, minlength: 10, maxlength: 1024},
    tags: {type: [String], default: []},
    habitId : {type : Types.ObjectId, ref: 'Habit'},
    userId: {type: Types.ObjectId, required: true, ref: 'User'},
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
    likes: {type: [Types.ObjectId], ref: 'User', default: []},
    likeCount: {type: Number, default: 0},
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<IPost>('Post', Post);

export default PostModel;
