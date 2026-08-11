import mongoose, { Schema, model, models } from 'mongoose';

const FeatureSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const SustainabilitySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    bgImage: { type: String }, // Background banner/image behind the 2 photos
    image1: { type: String, required: true }, // Front left photo
    image2: { type: String, required: true }, // Back right photo
    features: [FeatureSchema], // List of key points with checkmarks
  },
  { timestamps: true }
);

export default models.Sustainability || model('Sustainability', SustainabilitySchema);