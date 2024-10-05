import { IResponse } from "../common/types/shared";
import userRepository from "../repositories/User.repository.js";
import { IUser } from "../repositories/models/user";
import { hashSync, compareSync } from 'bcrypt';
import { JWT_SECRET, SALT_ROUNDS } from "../common/secrets.js";
import jwt from 'jsonwebtoken';
import _ from 'lodash';

class Auth {
    register = async (email: string, password: string, username: string) : Promise<IResponse<IUser>> => {
        let user = await userRepository.find(email, username);
        if(user){
            return {status: false, message: 'User already exists'};
        }
        const hashedPassword = hashSync(password, SALT_ROUNDS);
        user = await userRepository.create({email, password: hashedPassword, username});
        return {status: true, data: user, message: 'User created successfully'};
    }
   
    login = async (email: string, username: string, password: string) : Promise<IResponse<{user: IUser, token: string}>> => {
        const user = await userRepository.find(username, email);
        if(!user){
            return {status: false, message: 'User not found'};
        }
        if(user.isDeleted){
            return {status: false, message: 'User is deleted'};
        }
        if(!compareSync(password, user.password)){
            return {status: false, message: 'Invalid credentials'};
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        const id = user.id;
        const data = _.pick(user.toObject(), ['email', 'username', 'createdAt', 'isDeleted']);
        return {status: true, data : {user: {...data, id}, token}, message: 'Login successful'};
    }
    forgotPassword = async (email: string) : Promise<IResponse<string>> => {
        const user = await userRepository.find(email);
        if(!user){
            return {status: false, message: 'User not found'};
        }
        //send email with token
        return {status: true, message: 'Email sent'};
    }
    resetPassword = async (email: string, password: string, token: string) : Promise<IResponse<string>> => {
        const user = await userRepository.find(email);
        if(!user){
            return {status: false, message: 'User not found'};
        }
        //verify token and reset password
        return {status: true, message: 'Password reset successful'};
    }

    verifyEmail = async (email: string, token: string) : Promise<IResponse<string>> => {
        const user = await userRepository.find(email);
        if(!user){
            return {status: false, message: 'User not found'};
        }
        //verify token and update user
        return {status: true, message: 'Email verified'};
    }
}
const authServices = new Auth();
export default authServices;