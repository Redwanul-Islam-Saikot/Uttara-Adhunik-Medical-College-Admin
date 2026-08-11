import mongoose, { Schema, Document } from 'mongoose';

export interface IHospitalService extends Document {
  title: string;
  category: 'emergency' | 'diagnostic' | 'additional';
  createdAt?: Date;
}

const HospitalServiceSchema = new Schema<IHospitalService>(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['emergency', 'diagnostic', 'additional'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HospitalService ||
  mongoose.model<IHospitalService>('HospitalService', HospitalServiceSchema);