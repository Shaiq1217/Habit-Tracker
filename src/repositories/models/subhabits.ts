import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubHabit extends Document {
  name: string;
  description: string;
  points: number;
  habitId: Types.ObjectId;
  isDeleted: boolean;
}

const SubHabit: Schema = new Schema(
  {
    name: { type: String, required: true, default: '', minlength: 3, maxlength: 50 },
    description: { type: String,  default: '', minlength: 3, maxlength: 100 },
    points: {type: Number, required: true, default: 0, min: 0},
    completed: { type: Boolean, default: false },
    habitId: { type: Schema.Types.ObjectId, ref: 'Habit', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const SubhabitModel = mongoose.model<ISubHabit>('SubHabit', SubHabit);

export default SubhabitModel;
