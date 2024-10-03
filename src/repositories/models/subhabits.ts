import mongoose, { Schema, Document } from 'mongoose';

export interface ISubHabit extends Document {
  name: string;
  description: string;
  createdAt: Date;
}

const SubHabit: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    points: {type: Number, required: true},
    
  },
  {
    timestamps: true,
  }
);

const SubhabitModel = mongoose.model<ISubHabit>('SubHabit', SubHabit);

export default SubhabitModel;
