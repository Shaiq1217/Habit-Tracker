import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    bio: string;
    points: number;
    avatar: string;
    habits: Types.ObjectId[];
    friends: Types.ObjectId[];
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, minlength: 3, maxlength: 32, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, default: '' },
    points: { type: Number, default: 0 },
    avatar: { type: String, default: '' },
    habits: { type: [Types.ObjectId], default: [], ref: 'Habit' },
    friends: { type: [Types.ObjectId], default: [], ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
