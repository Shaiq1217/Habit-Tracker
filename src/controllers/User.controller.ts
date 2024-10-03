import {Request, Response} from 'express';
import userServices from '../services/User.service.js';
import { hashSync } from 'bcrypt';
import { SALT_ROUNDS } from '../common/secrets.js';

class User{
    register = async (req: Request, res: Response) =>{
        const {email, password, username} = req.body; 
        const hashedPassword =  hashSync(password, SALT_ROUNDS);
        const user = await userServices.register(email, hashedPassword, username);
        if(!user){
            return res.status(400).json({message: 'User already exists'});
        }
        return res.status(201).json(user);
    }
    login = async (req: Request, res: Response) => {
        const {email, username, password} = req.body;
        const data = await userServices.login(email, username, password);
        if(!data?.data.user) return res.status(400).json({message: 'Invalid credentials'});
        return res.status(200).json(data);

    }
    logout = (req: Request, res: Response) => {
        throw new Error('Method not implemented.');
    }
    me = async (req: Request, res: Response) => {
        const {username} = req.params;
        const user = await userServices.me(username);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json(user);
    }
    getAll = async (req: Request, res: Response) => {
        const {page, pageSize} = req.query;
        const pageInt = parseInt(page as string) || 1;
        const pageSizeInt = parseInt(pageSize as string) || 10; 
        const users = await userServices.getAll(pageInt, pageSizeInt);
        if(!users || users.length === 0){
            return res.status(404).json({message: 'No users found'});
        }
        return res.status(200).json(users);
    }
    update = (req: Request, res: Response) => {
        const {id} = req.params;
    }
    // delete = (req: Request, res: Response) => {
    //     throw new Error('Method not implemented.');
    // }
}

const userController = new User();
export default userController;