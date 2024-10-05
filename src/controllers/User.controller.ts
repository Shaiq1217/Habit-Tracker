import {Request, Response} from 'express';
import userServices from '../services/User.service.js';
import { hashSync } from 'bcrypt';

class User{
    me = async (req: Request, res: Response) => {
        const {username} = req.params;
        const me = await userServices.me(username);
        if(!me.status){
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json(me);
    }
    getById = async (req: Request, res: Response) => {
        const {id} = req.params;
        const user = await userServices.getById(id);
        if(!user.status){
            return res.status(404).json(user);
        }
        return res.status(200).json(user);
    }
    getAll = async (req: Request, res: Response) => {
        const {page, pageSize} = req.query;
        const pageInt = parseInt(page as string) || 1;
        const pageSizeInt = parseInt(pageSize as string) || 10; 
        const detail = req.query.detail as string as unknown as boolean;
        const allUsers = await userServices.getAll(pageInt, pageSizeInt, detail);
        if(!allUsers || allUsers.data.data.length === 0){
            return res.status(404).json(allUsers);
        }
        return res.status(200).json(allUsers);
    }
  
    update = async (req: Request, res: Response) => {
        const {id} = req.params;
        const data = req.body;
        const updatedUser = await userServices.update(id, data);
        if(!updatedUser.status){
            return res.status(400).json(updatedUser);
        }
    }
    delete = async (req: Request, res: Response) => {
        const {id} = req.params;
        const deletedUser = await userServices.delete(id);
        if(!deletedUser.status){
            return res.status(400).json(deletedUser);
        }
        return res.status(200).json(deletedUser);
    }
    addHabit = async (req: Request, res: Response) => {
        const {userId, habitId} = req.body;
        const habit = await userServices.addHabit(userId, habitId);
        if(!habit.status){
            return res.status(400).json(habit);
        }
        return res.status(200).json(habit);
    }
}

const userController = new User();
export default userController;