import { Request, Response } from "express";
import friendServices from "../services/Friend.service.js";
import { IFriend } from "../repositories/models/friends.js";
import { Types } from "mongoose";

class Friend{
    getFriends = async (req: Request, res: Response) => {
        const userId = req.params.userId
        const friends = await friendServices.getFriends(userId);
        if(!friends.status){
            return res.status(400).json(friends);
        }
        return res.status(200).json(friends);
    }

    createFriend = async (req: Request, res: Response) => {
        if(req.body.receiver == req.params.id){
            return res.status(400).json({status: false, message: 'You cannot send friend request to yourself'});
        }
        const requestor = new Types.ObjectId(req.params.id);
        const {receiver, status} = req.body;
        const friend : Partial<IFriend> = {requestor, receiver, status};
        const newFriend = await friendServices.create(friend);
        if(!newFriend.status){
            return res.status(400).json(newFriend);
        }
        return res.status(201).json(newFriend);
    }
    deleteFriend = async (req: Request, res: Response) => {
        throw new Error('Method not implemented.');
    }
    updateFriend = async (req: Request, res: Response) => {
        throw new Error('Method not implemented.');
    }
    deleteAll = async (req: Request, res: Response) => {
        const status = await friendServices.deleteAll();
        return res.status(200).json(status);
    }
    acceptFriend = async (req: Request, res: Response) => {
        const {reciever, requestor} = req.params;
        const friend = await friendServices.acceptFriend(reciever, requestor);
        if(!friend.status){
            return res.status(400).json(friend);
        }
        return res.status(200).json(friend);
    }
    getAllFriends = async (req: Request, res: Response) => {
        const friends = await friendServices.getAllFriends();
        if(!friends.status){
            return res.status(400).json(friends);
        }
        if(!friends.data.length){
            return res.status(404).json(friends);
        }
        return res.status(200).json(friends);
    }
   
}

const friendController = new Friend();
export default friendController;