import habitRepository from "../repositories/Habit.repository.js"
import { IHabit } from "../repositories/models/habit.js";
import {Types} from "mongoose";

class HabitService {
    get = async (id: string) => {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }
        const habit = await habitRepository.find(id);
        return habit;
    }
    getAll = async (page: number, pageSize: number) : Promise<{data: IHabit[], page: number, pageSize: number}> => {  
        let pageStart = page || 1;
        let totalPageSize = pageSize || 10;
        
        if(pageStart < 1) {
            pageStart = 1;
        }
        if(totalPageSize < 1) {
            totalPageSize = 10;
        }

        const data = await habitRepository.findAll(pageStart, totalPageSize);

        if (!data) {
            return {data: [], page: pageStart, pageSize: totalPageSize};
        }
        
        return {data, page: pageStart, pageSize: totalPageSize};
    }

    search = async (query: string, page: number, pageSize: number): Promise<{data: IHabit[], page: number, pageSize: number}> => {

        let pageStart = page || 1;
        let totalPageSize = pageSize || 10;

        if(pageStart < 1) {
            pageStart = 1;
        }
        if(totalPageSize < 1) {
            totalPageSize = 10;
        }

        const data = await habitRepository.search(query, page, pageSize);
        if (!data) {
            return {data: [], page, pageSize};
        }
        return {data, page, pageSize};
    }
    create = async (data: IHabit) => {
        const habit = await habitRepository.create(data);
        return habit;
    }
    update = async (id: string, data: IHabit) => {
        if (!Types.ObjectId.isValid(id)) {
            return null;
        }
        const habit = await habitRepository.update(id, data);
        return habit;
    }
}

const habitService = new HabitService();
export default habitService;