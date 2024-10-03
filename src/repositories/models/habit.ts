import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IHabit extends Document {
  name: string;
  description: string;
  tags: string[];
  subhabit: Types.ObjectId;
  userId: Types.ObjectId;
  isDeleted: boolean;
}

const Habit: Schema = new Schema(
  {
    name: { type: String, required: true, minlength: 5, maxlength: 512 },
    description: { type: String, required: true, minlength: 10, maxlength: 1024},
    tags: {type: [String], default: []},
    subhabit : {type : [Types.ObjectId], ref: 'SubHabit', default: []},
    userId: {type: Types.ObjectId, required: true, ref: 'User'},
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const HabitModel = mongoose.model<IHabit>('Habit', Habit);

export default HabitModel;
