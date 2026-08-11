import { Schema, model, models } from 'mongoose';

// 1. Footer Settings Model
const FooterSettingsSchema = new Schema(
  {
    logo: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    copyrightText: { type: String, required: true },
  },
  { timestamps: true }
);

// 2. Recent Posts Model
const RecentPostSchema = new Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, default: '#' },
  },
  { timestamps: true }
);

export const FooterSettings = models.FooterSettings || model('FooterSettings', FooterSettingsSchema);
export const RecentPost = models.RecentPost || model('RecentPost', RecentPostSchema);