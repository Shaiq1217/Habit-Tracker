import UserModel, { IUser } from "./models/user.js";
import _ from 'lodash';
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
    
    delete = async (id: string) => {
        const user = await UserModel.findByIdAndDelete(id);
        return user;
    }
}

const userRepository = new User();
export default userRepository;