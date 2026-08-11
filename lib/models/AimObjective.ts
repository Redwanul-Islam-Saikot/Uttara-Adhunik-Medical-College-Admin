import mongoose, { Schema, Document } from 'mongoose';

export interface IObjectiveCategory {
  title: string;
  points: string[];
}

export interface IAimObjective extends Document {
  aimTitle: string;
  aimDescription: string;
  objectiveTitle: string;
  imageUrl: string;
  categories: IObjectiveCategory[];
  footerText: string;
  createdAt: Date;
}

const AimObjectiveSchema: Schema = new Schema(
  {
    aimTitle: { type: String, default: 'Aim' },
    aimDescription: { type: String, required: true },
    objectiveTitle: { type: String, default: 'Objective' },
    imageUrl: { type: String, required: true },
    categories: [
      {
        title: { type: String, required: true },
        points: [{ type: String, required: true }],
      },
    ],
    footerText: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.AimObjective ||
  mongoose.model<IAimObjective>('AimObjective', AimObjectiveSchema);