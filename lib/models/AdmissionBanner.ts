import { Schema, model, models } from 'mongoose';

const AdmissionBannerSchema = new Schema(
  {
    highlightTitle: { type: String, required: true, default: 'UAMC' },
    mainTitle: { type: String, required: true, default: 'Admission' },
    description: { type: String, required: true },
    buttonText: { type: String, default: 'Learn More' },
    buttonLink: { type: String, default: '#' },
    backgroundImage: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.AdmissionBanner || model('AdmissionBanner', AdmissionBannerSchema);