import mongoose, { Schema, Document, models } from 'mongoose';

export interface IJobCircular extends Document {
  title: string;
  day: string;
  monthYear: string;
  time: string;
  pdfUrl?: string;
  createdAt: Date;
}

const JobCircularSchema = new Schema<IJobCircular>(
  {
    title: { type: String, required: true },
    day: { type: String, required: true },
    monthYear: { type: String, required: true },
    time: { type: String, required: true },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default models.JobCircular || mongoose.model<IJobCircular>('JobCircular', JobCircularSchema);