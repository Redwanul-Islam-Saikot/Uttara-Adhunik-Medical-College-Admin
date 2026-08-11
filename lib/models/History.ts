import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IHistory extends Document {
  titleRegular: string;
  titleBold: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
}

const HistorySchema = new Schema<IHistory>(
  {
    titleRegular: { type: String, required: true, default: 'History of' },
    titleBold: { type: String, required: true, default: 'Uttara Adhunik Medical College (UAMC)' },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.History || model<IHistory>('History', HistorySchema);