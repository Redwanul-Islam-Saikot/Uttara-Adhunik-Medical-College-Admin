import mongoose, { Schema } from 'mongoose';

const HeroBannerSchema = new Schema(
  {
    page: { type: String, required: true, index: true }, // e.g. 'overview', 'facilities', 'admission', 'notice', 'contactUs'
    breadcrumb: { type: String, required: true },
    titleRegular: { type: String, required: true },
    titleBold: { type: String, required: true },
    logoUrl: { type: String, default: '' },
    bgImageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.HeroBanner || mongoose.model('HeroBanner', HeroBannerSchema);