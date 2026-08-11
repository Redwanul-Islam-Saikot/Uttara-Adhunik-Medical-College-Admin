import mongoose, { Schema, Document } from 'mongoose';

export interface IHospitalInfo extends Document {
  title: string;
  boldHeader?: string;
  description: string;
  icon?: string;
  mainImage?: string;
  stat1Number: string;
  stat1Label: string;
  stat1Subtext?: string;
  stat2Number: string;
  stat2Label: string;
  stat2Subtext?: string;
  additionalStructures?: string;
}

const HospitalInfoSchema = new Schema<IHospitalInfo>(
  {
    title: { type: String, required: true },
    boldHeader: { type: String, default: '' },
    description: { type: String, required: true },
    icon: { type: String, default: '' },
    mainImage: { type: String, default: '' },
    stat1Number: { type: String, required: true },
    stat1Label: { type: String, required: true },
    stat1Subtext: { type: String, default: '' },
    stat2Number: { type: String, required: true },
    stat2Label: { type: String, required: true },
    stat2Subtext: { type: String, default: '' },
    additionalStructures: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.HospitalInfo ||
  mongoose.model<IHospitalInfo>('HospitalInfo', HospitalInfoSchema);