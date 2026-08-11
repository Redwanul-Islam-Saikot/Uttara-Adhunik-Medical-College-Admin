import mongoose, { Schema, model, models } from 'mongoose';

const HeroBannerSchema = new Schema(
  {
    breadcrumb: { type: String, required: true },
    titleRegular: { type: String, required: true },
    titleBold: { type: String, required: true },
    logoUrl: { type: String, required: true },
    bgImageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const HeroBanner = models.HeroBanner || model('HeroBanner', HeroBannerSchema);
export default HeroBanner;