import mongoose, { Schema, model, models } from 'mongoose';

const AdmissionAidSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image1: { type: String, required: true }, // Left tall image
    image2: { type: String, required: true }, // Top right image
    image3: { type: String, required: true }, // Bottom right image
    links: [
      {
        label: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default models.AdmissionAid || model('AdmissionAid', AdmissionAidSchema);