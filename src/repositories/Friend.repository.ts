import { Types } from "mongoose";
import FriendModel, { IFriend } from "./models/friends.js";
import UserModel from "./models/user.js";

class Friend {
    findOne = async (data: Partial<IFriend>): Promise<IFriend | null> => {
        const { requestor, receiver } = data;
        const friend = await FriendModel.findOne({
            requestor,
            receiver,
            status: { $in: ['pending', 'accepted'] } 
        });
    
        if (!friend) {
            return null;
        }
        return friend;
    }
    find = async (id: string): Promise<IFriend[]> => {
        const friends = await FriendModel.find({
            $or: [
                { requestor: id, status: 'accepted' },
                { receiver: id, status: 'accepted' }
            ]
        });
        return friends;
    }
    findRequest = async (id: string, page: number, pageSize: number): Promise<IFriend[]> => {
        const skip = (page - 1) * pageSize;
        const friends = await FriendModel.find({
          receiver: id,
          status: 'pending'
        })
        .skip(skip)
        .limit(pageSize);
        return friends;
      };
    countRequests = async (id: string): Promise<number> => {
        const count = await FriendModel.countDocuments({
          receiver: id,
          status: 'pending'
        });
        return count;
      };

    findById = async (id: string): Promise<IFriend | null> => {
        const friend = await FriendModel.findById(id);
        if (!friend) {
            return null;
        }
        return friend;
    }
    findAll = async (page: number, pageSize: number): Promise<IFriend[]> => {
        const skip = (page - 1) * pageSize;
        const friends = await FriendModel.find({}).skip(skip)
        .limit(pageSize);;
        return friends;
    }
    create = async (data: Partial<IFriend>) : Promise<IFriend> => {
        const friend = new FriendModel({...data, status: data.status ?? 'pending'});
        const newFriend = await friend.save();
        return newFriend;
    }
    update = async (id: string, data: Partial<IFriend>) : Promise<IFriend | null> => {
        const friend = await FriendModel.findByIdAndUpdate(id, data, {new: true});
        return friend;
    }
    addFriend = async (id: string, friendId: string) => {
        const user = await UserModel.findById(id);
        if(!user){
            return null;
        }
        if(!Types.ObjectId.isValid(friendId)){
            return null;
        }
        const friendObjectId = new Types.ObjectId(friendId)
        user.friends.push(friendObjectId);
        const newUser = await user.save();
        return newUser;
    }
    removeFriend = async (id: string, friendId: string) => {
        const user = await UserModel.findById(id);
        if(!user){
            return null;
        }
        if(!Types.ObjectId.isValid(friendId)){
            return null;
        }
        const friendObjectId = new Types.ObjectId(friendId)
        user.friends = user.friends.filter(friend => !friend.equals(friendObjectId));
        const newUser = await user.save();
        return newUser;
    }
    deleteAll = async () => {
        const status = await FriendModel.deleteMany({});
        return status;
    }

}
const friendServices = new Friend();
export default friendServices;