import { IResponse } from "../common/types/shared";
import { IFriend } from "../repositories/models/friends";
import friendRepository from "../repositories/Friend.repository.js";
import { Types } from "mongoose";
import { DeleteResult } from "mongodb"; 
import userServices from "./User.service.js";
import { IUser } from "../repositories/models/user";

class Friend {
    create = async (data : Partial<IFriend>): Promise<IResponse<IFriend>> => {
        const checkExist = await friendRepository.findOne(data);
        if(checkExist){
            return {status: false, message: 'Friend request already exist'};
        }
        const userOneExist = await userServices.getById(data.requestor.toString());
        const userTwoExist = await userServices.getById(data.receiver.toString());
        if(!userOneExist.status || !userTwoExist.status){
            return {status: false, 
                    message: `${userOneExist.status ? 
                        `${data.receiver.toString()}` : 
                        `${data.requestor.toString()}`} does not exist`};
        }
        const friend = await friendRepository.create(data);
        if(!friend){
            return {status: false, message: 'Failed to create friend'};
        }
        const user = await userServices.addFriend(data.requestor.toString(), friend.id);
        const friendRequested = await userServices.addFriend(data.receiver.toString(), friend.id);
        if(!user.status || !friendRequested.status){
            return {status: false, message: 'Failed to create friend'};
        }
        if(!friend){
            return {status: false, message: 'Failed to create friend'};
        }
        return {status: true, data: friend, message: 'Friend created successfully'};
    }
    getFriends = async (id: string): Promise<IResponse<IUser[]>> => {
       const user = await userServices.getById(id);
         if(!user.status){
              return {status: false, message: 'User not found'};
         }
        const friends = await friendRepository.find(user.data._id.toString());
        if(!friends || friends.length === 0){
            return {status: false, message: 'No friends found'};
        }
        const friendsData = friends.map(friend =>  friend.receiver.toString());
        const friendsInfo = await userServices.getMultiple(friendsData);
        if(!friendsInfo.status){
            return {status: false, message: 'Failed to get friends'};
        }
        return {status: true, data: friendsInfo.data, message: 'Friends found'};
    }
    getAllFriends = async (): Promise<IResponse<IFriend[]>> => {
        const friends = await friendRepository.findAll();
        if(!friends){
            return {status: false, message: 'Failed to get friends'};
        }
        if(!friends.length){
            return {status: false, message: 'No friends found'};
        }
        return {status: true, data: friends, message: 'Friends retrieved successfully'};
    }
    acceptFriend = async (receiverId: string, requestorId: string): Promise<IResponse<IFriend | null>> => {
        const receiver = new Types.ObjectId(receiverId);
        const requestor = new Types.ObjectId(requestorId);
        const friendExist = await friendRepository.findOne({receiver, requestor});
        if(!friendExist){
            return {status: false, message: 'Friend request not found'};
        }
        if(friendExist.status === 'accepted'){
            return {status: false, message: 'Friend request already accepted'};
        }
        const friend = await friendRepository.update(friendExist.id, {status: 'accepted'});
        if(!friend){
            return {status: false, message: 'Failed to accept friend request'};
        }
        return {status: true, data: friend, message: 'Friend request accepted successfully'};
    }
   
    deleteAll = async (): Promise<IResponse<Number>> => {
        const status = await friendRepository.deleteAll();
        return {status: status.acknowledged, data: status.deletedCount, message: 'All friends deleted successfully'};
    }
  
}

const friendServices = new Friend();
export default friendServices;