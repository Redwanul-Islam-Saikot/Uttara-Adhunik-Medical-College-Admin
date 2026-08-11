import mongoose, { Schema, Document, models } from 'mongoose';

export interface IGeneralNotice extends Document {
  title: string;
  day: string;
  monthYear: string;
  time: string;
  pdfUrl?: string;
  createdAt: Date;
}

const GeneralNoticeSchema = new Schema<IGeneralNotice>(
  {
    title: { type: String, required: true },
    day: { type: String, required: true },
    monthYear: { type: String, required: true },
    time: { type: String, required: true },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default models.GeneralNotice || mongoose.model<IGeneralNotice>('GeneralNotice', GeneralNoticeSchema);