import jwt from "jsonwebtoken";
import userRepository from "../repositories/User.repository.js";
import { compareSync, hashSync} from 'bcrypt';
import _ from 'lodash';
import { IResponse } from "../common/types/shared.js";
import { IUser } from "../repositories/models/user.js";
import { SALT_ROUNDS } from "../common/secrets.js";
import habitService from "./Habit.service.js";
class User{
    register = async (email: string, password: string, username: string) : Promise<IResponse<IUser>> => {
        let user = await userRepository.find(email, username);
        if(user){
            return {status: false, message: 'User already exists'};
        }
        const hashedPassword = hashSync(password, SALT_ROUNDS);
        user = await userRepository.create({email, password: hashedPassword, username});
        return {status: true, data: user, message: 'User created successfully'};
    }

    me = async (username: any): Promise<IResponse<IUser>> => {
        const user = await userRepository.find(username);
        if(!user){
            return {status: false, message: 'User not found'};
        }
        if(user.isDeleted){
            return {status: false, message: 'User is deleted'};
        }
        const sanitizedUser = _.omit(user.toObject(), ['password', 'updatedAt', 'createdAt'])
        return {status: true, data: sanitizedUser, message: 'User found'};
    }

    getById = async (id: string): Promise<IResponse<IUser>> => {
        const user = await userRepository.findById(id);
        if(!user){
            return {status: false, message: 'User not found'};
        }
        if(user.isDeleted){
            return {status: false, message: 'User is deleted'};
        }
         const filteredHabits = user.habits.filter(habit => {
             if ('isDeleted' in habit) { 
                 return !habit.isDeleted;
             }
             return true;
         });

        // Replace the habits field with the filtered habits
         const userWithFilteredHabits = { ...user.toObject(), habits: filteredHabits };

        const sanitizedUser = _.omit(userWithFilteredHabits, ['password', 'updatedAt', 'createdAt'])
        return {status: true, data: sanitizedUser, message: 'User found'};
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
        const data = _.pick(user.toObject(), ['email', 'username', 'createdAt', 'isDeleted']);
        return {status: true, data : {user: data, token}, message: 'Login successful'};
    }
    getAll = async (page: number, pageSize: number, detail?: boolean): Promise<IResponse<{data: IUser[], page: Number, pageSize: Number}>> => {
        const users = await userRepository.findAll(page, pageSize);
        if(!users || users.length === 0){
            return {status: false, message: 'No users found'};
        }
        const activeUsers = users.filter(user => !user.isDeleted);
        if(activeUsers.length === 0){
            return {status: false, message: 'No active users found'};
        }
        const usersData = activeUsers.map(user => _.pick(user.toObject(), ['email', 'username', 'createdAt', 'isDeleted']));
        return {status: true, data:{data: detail ? usersData : activeUsers, page, pageSize}, message: 'Users found'};
    }
    update = async (id: string, data: IUser) : Promise<IResponse<IUser>>=> {
        if(data.password){
            data.password = hashSync(data.password);
        }
        if(data.isDeleted){
            return {status: false, message: 'Cannot delete user'};
        }
        const user = await userRepository.update(id, data);
        
        return {status: true, data: user, message: 'User updated successfully'};
    }

    delete = async (id: string): Promise<IResponse<IUser>> => {
        const user = await userRepository.delete(id);
        if(!user){
            return {status: false, message: 'User not found'};
        }
        return {status: true, data: user, message: 'User deleted successfully'};
    }
    
    addHabit = async (userId: string, habitId: string) : Promise<IResponse<IUser>> => {
        if(!userId || !habitId){
            return {status: false, message: 'Invalid data'};
        }
        const habitExists = await habitService.get(habitId);
        if(!habitExists.status){
            return {status: false, message: 'Habit not found'};
        }
        const user = await userRepository.addHabit(userId, habitId);
        if(!user){
            return {status: false, message: 'User not found'};
        }
        return {status: true, message: 'Habit added to user'};
    }
}

const userServices = new User();
export default userServices;