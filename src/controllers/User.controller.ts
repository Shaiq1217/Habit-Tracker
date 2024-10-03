import {Request, Response} from 'express';
import userServices from '../services/User.service.js';
import { hashSync } from 'bcrypt';

class User{
    register = async (req: Request, res: Response) =>{
        const {email, password, username} = req.body; 
        const user = await userServices.register(email, password, username);
        if(!user || !user.status){
            return res.status(400).json(user);
        }
        return res.status(201).json(user);
    }
    login = async (req: Request, res: Response) => {
        const {email, username, password} = req.body;
        const userAndToken = await userServices.login(email, username, password);
        if(!userAndToken?.status) return res.status(400).json(userAndToken);
        return res.status(200).json(userAndToken);
    }
    logout = (req: Request, res: Response) => {
        throw new Error('Method not implemented.');
    }
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
        const allUsers = await userServices.getAll(pageInt, pageSizeInt);
        if(!allUsers || allUsers.data.length === 0){
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
}

const userController = new User();
export default userController;