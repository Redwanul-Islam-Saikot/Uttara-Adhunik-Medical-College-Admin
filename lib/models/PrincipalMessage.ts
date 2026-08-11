import mongoose, { Schema, Document } from 'mongoose';

export interface IPrincipalMessage extends Document {
  subHeading: string;
  titleBlack: string;
  titleYellow: string;
  honorableText: string;
  name: string;
  designationMain: string;
  designationSub: string;
  tagline: string;
  description: string;
  signatureImage?: string;
  principalImage?: string;
  buttonText: string;
  buttonLink: string;
}

const PrincipalMessageSchema: Schema = new Schema(
  {
    subHeading: { type: String, default: 'knowledge meets innovation' },
    titleBlack: { type: String, default: 'Message from the' },
    titleYellow: { type: String, default: 'Principal' },
    honorableText: { type: String, default: 'Honorable' },
    name: { type: String, required: true },
    designationMain: { type: String, required: true },
    designationSub: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    signatureImage: { type: String, default: '' }, // required তুলে দেওয়া হয়েছে
    principalImage: { type: String, default: '' }, // required তুলে দেওয়া হয়েছে
    buttonText: { type: String, default: 'Read More' },
    buttonLink: { type: String, default: '/principal-message' },
  },
  { timestamps: true }
);

export default mongoose.models.PrincipalMessage ||
  mongoose.model<IPrincipalMessage>('PrincipalMessage', PrincipalMessageSchema);