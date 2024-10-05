import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFriend extends Document {
    requestor: Types.ObjectId;
    receiver: Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
    isDeleted: boolean;

}

const Friend: Schema = new Schema(
  {
    requestor: { type: Types.ObjectId, required: true, ref: 'User' },
    receiver: { type: Types.ObjectId, required: true, ref: 'User' },
    status: { type: String, required: true, enum: ["pending", "accepted", "rejected"] },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const FriendModel = mongoose.model<IFriend>('Friend', Friend);

export default FriendModel;
