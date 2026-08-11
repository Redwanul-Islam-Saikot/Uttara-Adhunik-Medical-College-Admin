import { Schema, model, models } from 'mongoose';

const OurFacilitySchema = new Schema(
  {
    title: { type: String, required: true }, // e.g., "Hostel", "Laboratory"
    slug: { type: String, required: true, unique: true }, // e.g., "hostel", "laboratory"
    heading: { type: String, required: true },
    fullDescription: { type: String, required: true },
    image: { type: String, required: true },
    buttonText: { type: String, default: 'View Our Program' },
    buttonLink: { type: String, default: '#' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.OurFacility || model('OurFacility', OurFacilitySchema);