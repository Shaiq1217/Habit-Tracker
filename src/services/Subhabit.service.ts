import { isValidObjectId } from "mongoose";
import { IResponse } from "../common/types/shared";
import subhabitRepository from "../repositories/Subhabit.repository.js";
import { ISubHabit } from "../repositories/models/subhabits.js";
import habitService from "./Habit.service.js";

class Subhabit {
    checkHabitExists = async (habitId: string): Promise<boolean> => {
        const checkHabit = await habitService.get(habitId);
        return checkHabit.status;
    }
    create = async (data: Partial<ISubHabit>) : Promise<IResponse<ISubHabit>> => {
        if(data.isDeleted) return { status: false, message: "Can not add a deleted subhabit" };
        if(data.habitId) {
            const habitExists = await this.checkHabitExists(data.habitId.toString());
            if (!habitExists) {
                return { status: false, message: "Habit not found" };
            }
        }
        const subhabit = await subhabitRepository.create(data);
        if (!subhabit) {
            return { status: false, message: "Failed to create subhabit" };
        }
        const addSubhabitToHabit = await habitService.addSubhabitToHabit(data.habitId.toString(), subhabit._id.toString());
        if (!addSubhabitToHabit.status) {
            return { status: false, message: "Failed to add subhabit to habit" };
        }
        return { status: true, message: "Subhabit created successfully", data: subhabit };
    }

    update = async (id: string, data: Partial<ISubHabit>) => {
        if(data.habitId) {
            const habitExists = await this.checkHabitExists(data.habitId.toString());
            if (!habitExists) {
                return { status: false, message: "Habit not found" };
            }
        }
        
        const subhabit = await subhabitRepository.find(id);
        if (!subhabit) {
            return { status: false, message: "Subhabit not found" };
        }
        const updatedSubhabit = await subhabitRepository.update(id, data);
        if (!updatedSubhabit) {
            return { status: false, message: "Failed to update subhabit" };
        }
        return { status: true, message: "Subhabit updated successfully", data: updatedSubhabit };
    }

    delete = async(id: string) => {
        const subhabit = await subhabitRepository.find(id);
        if (!subhabit) {
            return { status: false, message: "Subhabit not found" };
        }
        const deletedSubhabit = await subhabitRepository.delete(id);
        if (!deletedSubhabit) {
            return { status: false, message: "Failed to delete subhabit" };
        }
        return { status: true, message: "Subhabit deleted successfully", data: deletedSubhabit };
    }

    get = async (id: string) => {
        const subhabit = await subhabitRepository.find(id);
        if (!subhabit) {
            return { status: false, message: "Subhabit not found" };
        }
        return { status: true, message: "Subhabit found", data: subhabit };
    }
    getByHabit = async (id: string) => {
        const subhabits = await subhabitRepository.findAllByHabit(id);
        if (!subhabits) {
            return { status: false, message: "Subhabit not found" };
        }
        return { status: true, message: "Subhabit found", data: subhabits };
    }
}

const subhabitServices = new Subhabit();
export default subhabitServices;