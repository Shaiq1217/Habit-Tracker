
import HabitModel, { IHabit } from "./models/habit.js";

class HabitRepository {
    find = async (id: string) : Promise<IHabit> | null => {
        const habit = await HabitModel.findById(id);
        if(!habit){
            return null;
        }
        return habit;
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
            subhabit: subhabit ? subhabit : null
        })
        return habit.save();
    }

    
    update = async (id: string, data: IHabit) => {
        const habit = await HabitModel.findByIdAndUpdate(id, data, {new: true});
        return habit;
    }

}

const habitRepository = new HabitRepository();
export default habitRepository;