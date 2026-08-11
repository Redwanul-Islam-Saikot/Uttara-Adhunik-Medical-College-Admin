import mongoose, { Schema, model, models } from 'mongoose';

export interface INotice {
  _id?: string;
  title: string;
  day: string;
  monthYear: string;
  time: string;
  category: 'General Notice' | 'Admission Notice' | 'Reports' | 'Job Circular';
  pdfUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    day: { type: String, required: true },
    monthYear: { type: String, required: true },
    time: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['General Notice', 'Admission Notice', 'Reports', 'Job Circular'],
    },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Notice = models.Notice || model<INotice>('Notice', NoticeSchema);