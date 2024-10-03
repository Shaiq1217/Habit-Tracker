import { IResponse } from "../common/types/shared.js";
import habitRepository from "../repositories/Habit.repository.js"
import { IHabit } from "../repositories/models/habit.js";
import {Types} from "mongoose";
import userServices from "./User.service.js";
import _ from 'lodash';

class HabitService {
    get = async (id: string) : Promise<IResponse<IHabit>>=> {
        if (!Types.ObjectId.isValid(id)) {
            return {status: false, message: 'Invalid id'};
        }
        const habit = await habitRepository.find(id);
        if(!habit){
            return {status: false, message: 'Habit not found'};
        }
        if(habit.isDeleted){
            return {status: false, message: 'Habit is deleted'};
        }
        return {status: true, data: habit, message: 'Habit found'};
    }
    getAll = async (page: number, pageSize: number) : Promise<IResponse<{habits: IHabit[], page: number, pageSize: number}>> => {  
        let pageStart = page || 1;
        let totalPageSize = pageSize || 10;
        
        if(pageStart < 1) {
            pageStart = 1;
        }
        if(totalPageSize < 1) {
            totalPageSize = 10;
        }

        const data = await habitRepository.findAll(pageStart, totalPageSize);
        if (!data || data.length === 0) {
            return {status: false, message: 'No habits found'};
        }
        const activeHabits = data.filter(habit => habit.isDeleted);
        if(activeHabits.length === 0){
            return {status: false, message: 'No active habits found'};
        }
        const sanitizedHabits = activeHabits.map(habit => _.omit(habit.toObject(), ['updatedAt', 'createdAt', 'isDeleted']));
        return {data : {habits: sanitizedHabits, page: pageStart, pageSize: totalPageSize}, status: true, message: 'Habits found'};
    }

    search = async (query: string, page: number, pageSize: number): Promise<IResponse<{habits: IHabit[], page: number, pageSize: number}>> => {

        let pageStart = page || 1;
        let totalPageSize = pageSize || 10;

        if(pageStart < 1) {
            pageStart = 1;
        }
        if(totalPageSize < 1) {
            totalPageSize = 10;
        }

        const data = await habitRepository.search(query, page, pageSize);
        if (!data || data.length === 0) {
            return {status: false, message: 'No habits found'};
        }
        const activeHabits = data.filter(habit => habit.isDeleted);
        if(activeHabits.length === 0){
            return {status: false, message: 'No active habits found'};
        }
        const sanitizedHabits = activeHabits.map(habit => _.omit(habit.toObject(), ['updatedAt', 'createdAt', 'isDeleted']));
        return {data : {habits: sanitizedHabits, page: pageStart, pageSize: totalPageSize}, status: true, message: 'Habits found'};
    }
    create = async (data: IHabit) : Promise<IResponse<IHabit>> => {
        const doesExist = await userServices.getById(data.userId.toString());
        if(!doesExist.status) {
            return {status: false, message: 'User not found'};
        }
        const doesHabitExist = await habitRepository.findByName(data.name, data.userId.toString());
        if(doesHabitExist) {
            return {status: false, message: 'Habit already exists'};
        }
        const habit = await habitRepository.create(data);
        if(!habit){
            return {status: false, message: 'Habit not created'};
        }
        const sanitizedHabits = _.omit(habit.toObject(), ['updatedAt', 'createdAt', 'isDeleted']);
        return {status: true, data: sanitizedHabits, message: 'Habit created successfully'};
    }
    update = async (id: string, data: IHabit) : Promise<IResponse<IHabit>> => {
        if (!Types.ObjectId.isValid(id)) {
            return {status: false, message: 'Invalid id'};
        }
        if(data.isDeleted){
            return {status: false, message: 'Cannot delete habit'};
        }
        const doesExist = await userServices.getById(data.userId.toString());
        if(!doesExist.status) {
            return {status: false, message: 'User not found'};
        }
        const habit = await habitRepository.update(id, data);
        if(!habit){
            return {status: false, message: 'Habit not updated'};
        }
        if(habit.isDeleted){
            return {status: false, message: 'Habit is deleted'};
        }
        return {status: true, data: habit, message: 'Habit updated successfully'};
    }
}

const habitService = new HabitService();
export default habitService;