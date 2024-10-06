import UserModel, { IUser } from "./models/user.js";
import _ from 'lodash';
import { Types } from 'mongoose';
class User{
    find = async (username: string, email?: string) : Promise<IUser> | null => {
        let user = await UserModel.findOne({ username });
        if (!user && email) {
            user = await UserModel.findOne({ email });
        }
        if (!user) {
            return null;
        }
        return user;
    }
    findById = async (id: string) : Promise<IUser> | null => {
        const user = await UserModel.findById(id).populate('habits').populate('friends').exec();
        if(!user){
            return null;
        }
        return user
    }
    findAll = async (page: number, pageSize: number) : Promise<IUser[]> => {
        const users = await UserModel.find({}).skip((page - 1) * pageSize).limit(pageSize);
        if(!users){
            return [];
        }
        return users;
    }
    
    search = async (query: string, page: number, pageSize: number) : Promise<IUser[]> => {
        const users = await UserModel.find({$text: {$search: query}}).skip(page * pageSize).limit(pageSize);
        if(!users){
            return [];
        }
        return users;
    }

    create = async (data : Partial<IUser>): Promise<IUser> => {
        const {username, email, password} = data;
        const user = new UserModel({
            username,
            email,
            password
        })
        return user.save();
    }

    update = async (id: string, data: IUser) => {
        const user = await UserModel.findByIdAndUpdate(id, data, {
            new: true
            });
        return user.save();
    }
    addHabit = async (id: string, habitId: string) => {
        const user = await UserModel.findById(id);
        if(!user){
            return null;
        }
        if(!Types.ObjectId.isValid(habitId)){
            return null;
        }
        const habitObjectId = new Types.ObjectId(habitId)
        user.habits.push(habitObjectId);
        const newUser = await user.save();
        return newUser;
    }

  
    delete = async (id: string) => {
        const user = await UserModel.findById(id);
        if(!user){
            return null;
        }
        user.isDeleted = true;
        const newUser = await user.save();
        return newUser;
    }
 
    getFriends = async (id: string) => {
        const user = await UserModel.findById(id).populate('friends').exec();
        if(!user){
            return null;
        }
        const friends = user?.friends;
        const friendIds = friends?.map(friend => friend._id);
        const friendUsers = await UserModel.find({_id: {$in: friendIds}});
        if(!friendUsers || friendUsers.length === 0){
            return null;
        }
        return friendUsers;
    }
    findMany = async (ids: string[]) => {
        const users = await UserModel.find({_id: {$in: ids}});
        if(!users){
            return null;
        }
        return users;
    }
}

const userRepository = new User();
export default userRepository;