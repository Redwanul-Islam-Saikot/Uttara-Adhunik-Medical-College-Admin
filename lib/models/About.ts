import mongoose, { Schema, Document } from 'mongoose';

export interface IAbout extends Document {
  tagline: string;
  taglineLogo?: string;
  titlePrefix: string;
  titleHighlight?: string;
  description1Bold?: string; // 👈 বোল্ড টেক্সট ফিল্ড
  description1: string;
  description2?: string;
  knowledgeText?: string;   // 👈 Knowledge টেক্সট ফিল্ড
  knowledgeLogo?: string;   // 👈 Knowledge লোগো ফিল্ড
  missionText?: string;
  missionLogo?: string;
  visionText?: string;
  visionLogo?: string;
  buttonText?: string;
  buttonLink?: string;
  image1?: string;
  image2?: string;
  logo?: string;
}

const AboutSchema: Schema = new Schema(
  {
    tagline: { type: String, required: true },
    taglineLogo: { type: String, default: '' },
    titlePrefix: { type: String, required: true },
    titleHighlight: { type: String, default: '' },
    description1Bold: { type: String, default: '' },
    description1: { type: String, required: true },
    description2: { type: String, default: '' },
    knowledgeText: { type: String, default: '' },
    knowledgeLogo: { type: String, default: '' },
    missionText: { type: String, default: '' },
    missionLogo: { type: String, default: '' },
    visionText: { type: String, default: '' },
    visionLogo: { type: String, default: '' },
    buttonText: { type: String, default: '' },
    buttonLink: { type: String, default: '' },
    image1: { type: String, default: '' },
    image2: { type: String, default: '' },
    logo: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema);