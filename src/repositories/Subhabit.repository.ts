import SubhabitModel, { ISubHabit } from "./models/subhabits.js";

class Subhabit {
    create = async (data: Partial<ISubHabit>) : Promise<ISubHabit> | null=> {
        const subhabit = new SubhabitModel(data);
        if (!subhabit) {
            return null;
        }
        await subhabit.save();
        return subhabit;
    }

    update = async (id: string, data: Partial<ISubHabit>) => {
        const subhabit = await SubhabitModel.findByIdAndUpdate(id, data);
        if (!subhabit) {
            return null;
        }
        return subhabit;
    }

    delete = async(id: string) => {
        const subhabit = await SubhabitModel.findByIdAndUpdate(id, {isDeleted: true});  
        if (!subhabit) {
            return null;
        }
        return subhabit;
    }

    find = async (id: string) => {
        const subhabit = await SubhabitModel.findOne({ _id: id, isDeleted: false });
        if (!subhabit) {
            return null;
        }
        if(subhabit.isDeleted) {
            return null;
        }
        return subhabit;
    }
    findAllByHabit = async (id: string) => {
        const subhabits = await SubhabitModel.find({habitId: id, isDeleted: false});
        return subhabits;
    }
}

const subhabitRepository = new Subhabit();
export default subhabitRepository;