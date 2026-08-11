import mongoose, { Schema, Document, models } from 'mongoose';

export interface IAdmissionNotice extends Document {
  title: string;
  day: string;
  monthYear: string;
  time: string;
  pdfUrl?: string;
  createdAt: Date;
}

const AdmissionNoticeSchema = new Schema<IAdmissionNotice>(
  {
    title: { type: String, required: true },
    day: { type: String, required: true },
    monthYear: { type: String, required: true },
    time: { type: String, required: true },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default models.AdmissionNotice || mongoose.model<IAdmissionNotice>('AdmissionNotice', AdmissionNoticeSchema);