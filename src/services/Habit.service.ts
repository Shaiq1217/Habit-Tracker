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
        // check if userID is valid
        if(!Types.ObjectId.isValid(data.userId)) return {status: false, message: 'Invalid user id'};
        // check if user exists
        const doesExist = await userServices.getById(data.userId.toString());
       
        if(!doesExist.status) {
            return {status: false, message: 'User not found'};
        }
        // check if habit exists for user
        const doesHabitExist = await habitRepository.findByUser(data.name, data.userId.toString());
        if(doesHabitExist.length > 0) {
            return {status: false, message: 'Habit already exists'};
        }
        // create habit
        const habit = await habitRepository.create(data);
        if(!habit){
            return {status: false, message: 'Habit not created'};
        }
        // add habit to user
        const addHabitToUser = await userServices.addHabit(data.userId.toString(), habit._id.toString());
        if(!addHabitToUser.status) {
            return {status: false, message: 'Habit not added to user'};
        }
        // return habit
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
        const habit = await habitRepository.update(id, data); 
        if(!habit){
            return {status: false, message: 'Habit not updated'};
        }
        if(habit.isDeleted){
            return {status: false, message: 'Habit is deleted'};
        }
        return {status: true, data: habit, message: 'Habit updated successfully'};
    }
    delete = async (id: string) : Promise<IResponse<IHabit>> => {
        if (!Types.ObjectId.isValid(id)) {
            return {status: false, message: 'Invalid id'};
        }
        const habit = await habitRepository.delete(id);
        if(!habit){
            return {status: false, message: 'Habit not found'};
        }
        return {status: true, data: habit, message: 'Habit deleted successfully'};
    }
    deleteAll = async () : Promise<IResponse<any>> => {
        const habits = await habitRepository.deleteAll();
        return {status: true, data: habits, message: 'Habits deleted successfully'};
    }
    addSubhabitToHabit = async (habitId: string, subhabitId: string) : Promise<IResponse<IHabit>> => {
        if (!Types.ObjectId.isValid(habitId) || !Types.ObjectId.isValid(subhabitId)) {
            return {status: false, message: 'Invalid id'};
        }
        const habit = await habitRepository.addSubhabit(habitId, subhabitId);
        if(!habit){
            return {status: false, message: 'Subhabit not added to habit'};
        }
        return {status: true, data: habit, message: 'Subhabit added to habit successfully'};
    }
}

const habitService = new HabitService();
export default habitService;