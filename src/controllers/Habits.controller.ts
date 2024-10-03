import { Request, Response } from 'express';
import habitService from '../services/Habit.service.js';
import { IHabit } from '../repositories/models/habit.js';

class Habit {
    getHabitById = async (req: Request, res: Response) => {
        const habit = await habitService.get(req.params.id);
        if (!habit) {
            return res.status(404).json({ data: [], message: 'No data found' });
        }       
        return res.status(200).json({ data: habit, message: 'Success' })
    }

    getHabits = async (req: Request, res: Response) => {
        const pageNumber = parseInt(req.query.page as string) || 1;  
        const size = parseInt(req.query.size as string) || 10;   

        const habits = await habitService.getAll(pageNumber, size);
        
        if (!habits.status) {
            return res.status(404).json(habits);
        }

        return res.status(200).json(habits);
    }
    
    
    createHabit = async (req: Request, res: Response) => {
        const habit: IHabit = req.body;
        const newHabit = await habitService.create(habit);
        if(!newHabit.status){
            return res.status(400).json(newHabit);
        }
        return res.status(201).json({ data: newHabit, message: 'Habit created' });
    }
    updateHabit = async (req: Request, res: Response) => {
        const habit: IHabit = req.body;
        const {id} = req.params;
        const updatedHabit = await habitService.update(req.params.id, habit);
        return res.status(200).json({ data: updatedHabit, message: 'Habit updated' });
    }
    deleteHabit = async (req: Request, res: Response) => {
        const habit = await habitService.delete(req.params.id);
        return res.status(200).json(habit);
    }
    deleteAll = async (req: Request, res: Response) => {
        const habit = await habitService.deleteAll();
        return res.status(200).json({ data: habit, message: 'All habits deleted' });
    }
}

const habitController = new Habit();
export default habitController;
