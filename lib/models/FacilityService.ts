import mongoose, { Schema, Document } from 'mongoose';

export interface IFacilityService extends Document {
  tabTitle: string;        // e.g. "Intensive Care Unit (ICU)"
  title: string;           // e.g. "Intensive Care Unit (ICU)"
  description: string;     // Short description
  image?: string;          // Base64 or Image URL
  buttonText?: string;     // e.g. "Learn More"
  buttonUrl?: string;      // Link destination
  order?: number;          // Tab order
}

const FacilityServiceSchema = new Schema<IFacilityService>(
  {
    tabTitle: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    buttonText: { type: String, default: 'Learn More' },
    buttonUrl: { type: String, default: '#' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.FacilityService ||
  mongoose.model<IFacilityService>('FacilityService', FacilityServiceSchema);