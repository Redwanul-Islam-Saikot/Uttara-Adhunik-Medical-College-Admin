import mongoose, { Schema, Document } from 'mongoose';

export interface IVision extends Document {
  titleRegular: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
}

const VisionSchema: Schema = new Schema(
  {
    titleRegular: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Mongoose Model Caching Clear Fix
export default mongoose.models.Vision || mongoose.model<IVision>('Vision', VisionSchema);