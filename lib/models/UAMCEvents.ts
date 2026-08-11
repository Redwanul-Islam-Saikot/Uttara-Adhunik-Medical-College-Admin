import mongoose, { Schema, Document } from 'mongoose';

export interface IUAMCEvent extends Document {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Past';
  speaker?: string;
  description: string;
  image?: string;
  createdAt: Date;
}

const UAMCEventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ['Upcoming', 'Past'], default: 'Upcoming' },
    speaker: { type: String },
    description: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.UAMCEvent || mongoose.model<IUAMCEvent>('UAMCEvent', UAMCEventSchema);