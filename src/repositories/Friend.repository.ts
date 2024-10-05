import FriendModel, { IFriend } from "./models/friends.js";

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
    findById = async (id: string): Promise<IFriend | null> => {
        const friend = await FriendModel.findById(id);
        if (!friend) {
            return null;
        }
        return friend;
    }
    findAll = async (): Promise<IFriend[]> => {
        const friends = await FriendModel.find({});
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
    deleteAll = async () => {
        const status = await FriendModel.deleteMany({});
        return status;

    }

}
const friendServices = new Friend();
export default friendServices;