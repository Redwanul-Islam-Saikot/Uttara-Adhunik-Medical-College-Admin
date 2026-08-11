import mongoose, { Schema, Document, models } from 'mongoose';

export interface IReportNotice extends Document {
  title: string;
  day: string;
  monthYear: string;
  time: string;
  pdfUrl?: string;
  createdAt: Date;
}

const ReportNoticeSchema = new Schema<IReportNotice>(
  {
    title: { type: String, required: true },
    day: { type: String, required: true },
    monthYear: { type: String, required: true },
    time: { type: String, required: true },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default models.ReportNotice || mongoose.model<IReportNotice>('ReportNotice', ReportNoticeSchema);