import { IResponse } from "../common/types/shared.js";
import { IFriend } from "../repositories/models/friends.js";
import friendRepository from "../repositories/Friend.repository.js";
import { Types } from "mongoose";
import userServices from "./User.service.js";
import { IUser } from "../repositories/models/user.js";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "../common/constants.js";

class Friend {
  create = async (data: Partial<IFriend>): Promise<IResponse<IFriend>> => {
    const checkExist = await friendRepository.findOne(data);
    if (checkExist) {
      return { status: false, message: "Friend request already exist" };
    }
    const userOneExist = await userServices.getById(data.requestor.toString());
    const userTwoExist = await userServices.getById(data.receiver.toString());
    if (!userOneExist.status || !userTwoExist.status) {
      return {
        status: false,
        message: `${
          userOneExist.status
            ? `${data.receiver.toString()}`
            : `${data.requestor.toString()}`
        } does not exist`,
      };
    }
    const friend = await friendRepository.create(data);
    if (!friend) {
      return { status: false, message: "Failed to create friend" };
    }
    const user = await this.addFriend(data.requestor.toString(), friend.id);
    const friendRequested = await this.addFriend(
      data.receiver.toString(),
      friend.id
    );
    if (!user.status || !friendRequested.status) {
      return { status: false, message: "Failed to create friend" };
    }
    if (!friend) {
      return { status: false, message: "Failed to create friend" };
    }
    return {
      status: true,
      data: friend,
      message: "Friend created successfully",
    };
  };
  getFriends = async (id: string, page: number = DEFAULT_PAGE, pageSize: number = DEFAULT_LIMIT): Promise<IResponse<IUser[]>> => {
    const user = await userServices.getById(id);
    if (!user.status) {
      return { status: false, message: "User not found" };
    }
    const friends = await friendRepository.find(user.data._id.toString());
    if (!friends || friends.length === 0) {
      return { status: false, message: "No friends found" };
    }
    const friendsData = friends.map((friend) => friend.receiver.toString());
    const friendsInfo = await userServices.getMultiple(friendsData);
    if (!friendsInfo.status) {
      return { status: false, message: "Failed to get friends" };
    }
    return { status: true, data: friendsInfo.data, message: "Friends found", page, pageSize };
  };
  getAllFriends = async (): Promise<IResponse<IFriend[]>> => {
    const friends = await friendRepository.findAll();
    if (!friends) {
      return { status: false, message: "Failed to get friends" };
    }
    if (!friends.length) {
      return { status: false, message: "No friends found" };
    }
    return {
      status: true,
      data: friends,
      message: "Friends retrieved successfully",
    };
  };
  acceptFriend = async (
    receiverId: string,
    requestorId: string
  ): Promise<IResponse<IFriend | null>> => {
    const receiver = new Types.ObjectId(receiverId);
    const requestor = new Types.ObjectId(requestorId);
    const friendExist = await friendRepository.findOne({ receiver, requestor });
    if (!friendExist) {
      return { status: false, message: "Friend request not found" };
    }
    if (friendExist.status === "accepted") {
      return { status: false, message: "Friend request already accepted" };
    }
    const friend = await friendRepository.update(friendExist.id, {
      status: "accepted",
    });
    if (!friend) {
      return { status: false, message: "Failed to accept friend request" };
    }
    return {
      status: true,
      data: friend,
      message: "Friend request accepted successfully",
    };
  };

  addFriend = async (
    userId: string,
    friendId: string
  ): Promise<IResponse<IUser>> => {
    const friend = await friendRepository.findById(friendId);
    if (!friend) {
      return { status: false, message: "Friend Request not found" };
    }
    const user = await friendRepository.addFriend(userId, friendId);
    if (!user) {
      return { status: false, message: "User not found" };
    }
    return { status: true, message: "Friend added to user" };
  };
  removeFriend = async (
    userId: string,
    friendId: string
  ): Promise<IResponse<IUser>> => {
    const friend = await friendRepository.findById(friendId);
    if (!friend) {
      return { status: false, message: "Friend Request not found" };
    }
    const removeFriendFromUser = await friendRepository.removeFriend(
      userId,
      friendId
    );
    const removeUserFromFriend = await friendRepository.removeFriend(
      friendId,
      userId
    );
    if (!removeFriendFromUser || !removeUserFromFriend) {
      return {
        status: false,
        message: `${removeFriendFromUser ? "User" : "Friend"}not found`,
      };
    }
    return { status: true, message: "Friend removed from user" };
  };
  deleteAll = async (): Promise<IResponse<number>> => {
    const status = await friendRepository.deleteAll();
    return {
      status: status.acknowledged,
      data: status.deletedCount,
      message: "All friends deleted successfully",
    };
  };
}

const friendServices = new Friend();
export default friendServices;
