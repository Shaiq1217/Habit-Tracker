import jwt from "jsonwebtoken";
import userRepository from "../repositories/User.repository.js";
import { compareSync } from 'bcrypt';
import _ from 'lodash';
import { IResponse } from "../common/types/shared.js";
import { IUser } from "../repositories/models/user.js";
class User{
    register = async (email: string, password: string, username: string) => {
        let user = await userRepository.find(email, username);
        if(user){
            return null;
        }
        user = await userRepository.create({email, password, username});
        return user;
    }

    me = async (username: any) => {
        const user = await userRepository.find(username);
        if(!user){
            return null;
        }
        return user;
    }
    
    login = async (email: string, username: string, password: string) : Promise<IResponse<{user: IUser, token: string}>> => {
        const user = await userRepository.find(username, email);
        if(!user){
            return {status: false, message: 'User not found'};
        }
        if(!compareSync(password, user.password)){
            return {status: false, message: 'Invalid credentials'};
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        const data = _.pick(user, ['email', 'username', 'createdAt', 'isDeleted']);
        return {status: true, data : {user: data, token}, message: 'Login successful'};
    }
    getAll = async (page: number, pageSize: number) => {
        const users = await userRepository.findAll(page, pageSize);
        if(!users || users.length === 0){
            return [];
        }
        const usersData = users.map(user => _.pick(user, ['email', 'username', 'createdAt', 'isDeleted']));
        return usersData;
    }
    
}

const userServices = new User();
export default userServices;