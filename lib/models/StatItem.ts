import { Schema, model, models } from 'mongoose';

export interface IStatItem {
  value: string;
  label: string;
  bgImage?: string;
  order?: number;
}

const StatItemSchema = new Schema<IStatItem>(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    bgImage: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.StatItem || model<IStatItem>('StatItem', StatItemSchema);