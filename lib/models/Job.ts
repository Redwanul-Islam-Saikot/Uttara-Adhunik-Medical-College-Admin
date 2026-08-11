import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: string;
  type: string;
  location: string;
  deadline: string;
  experience: string;
  description: string;
  requirements: string[];
  createdAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    type: { type: String, required: true },
    location: { type: String, required: true },
    deadline: { type: String, required: true },
    experience: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);