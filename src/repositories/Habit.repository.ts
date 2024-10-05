
import HabitModel, { IHabit } from "./models/habit.js";
import { Types } from "mongoose";

class HabitRepository {
    find = async (id: string) : Promise<IHabit> | null => {
        const habit = await HabitModel.findById(id).populate('subhabit').exec();
        if(!habit){
            return null;
        }
        return habit;
    }
    findByUser = async (name: string, userId: string) : Promise<IHabit[]> => {
        const habits = await HabitModel.find({name, userId});
        if(!habits){
            return [];
        }
        return habits;
    }

    findAll = async (page: number, pageSize: number) : Promise<IHabit[]> => {
        const habits = await HabitModel.find({}).skip((page - 1) * pageSize).limit(pageSize);
        if(!habits){
            return [];
        }
        return habits;
    }
    search = async (query: string, page: number, pageSize: number) : Promise<IHabit[]> => {
        const habits = await HabitModel.find({$text: {$search: query}}).skip(page * pageSize).limit(pageSize);
        if(!habits){
            return [];
        }
        return habits;
    }
    create = async (data : IHabit) => {
        const {name, description, tags, subhabit, userId} = data;
        const habit = new HabitModel({
            name: name,
            description: description,
            userId: userId,
            tags: tags,
        })
        const newHabit = await habit.save();
        return newHabit;
    }

    
    update = async (id: string, data: IHabit) => {
        const habit = await HabitModel.findByIdAndUpdate(id, data, {new: true});
        return habit;
    }

    delete = async (id: string) => {
        const habit = await HabitModel.findById(id);
        if(!habit){
            return null;
        }
        habit.isDeleted = true;
        const newHabit = await habit.save();
        return newHabit;
    }

    deleteAll = async () => {
        const habits = await HabitModel.deleteMany({});
        return habits;
    }
    addSubhabit = async (habitId: string, subhabitId: string) => {
        const habit = await HabitModel.findById(habitId);
        if(!habit){
            return null;
        }
        const objId = new Types.ObjectId(subhabitId);
        habit.subhabit.push(objId);
        const newHabit = await habit.save();
        return newHabit;
    };
}

const habitRepository = new HabitRepository();
export default habitRepository;