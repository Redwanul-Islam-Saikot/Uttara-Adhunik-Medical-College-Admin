import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IVisitingSection extends Document {
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  phone?: string;
  phoneSubtext?: string;
  buttonText?: string;
  buttonUrl?: string;
  departmentCount?: string;
  departmentSubtext?: string;
  image1?: string;
  image2?: string;
  badgeLogo?: string;
}

const VisitingSectionSchema = new Schema<IVisitingSection>(
  {
    title: { type: String, required: false },
    paragraph1: { type: String, required: false },
    paragraph2: { type: String, required: false },
    phone: { type: String, required: false },
    phoneSubtext: { type: String, required: false },
    buttonText: { type: String, required: false },
    buttonUrl: { type: String, required: false },
    departmentCount: { type: String, required: false },
    departmentSubtext: { type: String, required: false },
    image1: { type: String, required: false },
    image2: { type: String, required: false },
    badgeLogo: { type: String, required: false },
  },
  { timestamps: true }
);

export default models.VisitingSection || model<IVisitingSection>('VisitingSection', VisitingSectionSchema);