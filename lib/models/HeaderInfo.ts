import mongoose, { Schema, Document } from 'mongoose';

export interface IHeaderInfo extends Document {
  addressLine1: string;
  addressLine2: string;
  email: string;
  phone: string;
  collegeName: string;
  collegeSubtitle: string;
  logoUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
}

const HeaderInfoSchema = new Schema<IHeaderInfo>(
  {
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    collegeName: { type: String, required: true },
    collegeSubtitle: { type: String, required: true },
    logoUrl: { type: String, required: true },
    facebookUrl: { type: String, default: '#' },
    youtubeUrl: { type: String, default: '#' },
    linkedinUrl: { type: String, default: '#' },
    instagramUrl: { type: String, default: '#' },
  },
  { timestamps: true }
);

export default mongoose.models.HeaderInfo || mongoose.model<IHeaderInfo>('HeaderInfo', HeaderInfoSchema);