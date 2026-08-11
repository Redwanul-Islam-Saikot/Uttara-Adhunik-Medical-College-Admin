import mongoose, { Schema, model, models } from 'mongoose';

const NewsSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true }, // e.g. Education, University
    description: { type: String, required: true },
    image: { type: String, required: true }, // Base64 or Image URL
    author: { type: String, default: 'admin' },
    date: { type: String, required: true }, // e.g. August 6, 2024
    link: { type: String, default: '#' },
  },
  { timestamps: true }
);

const News = models.News || model('News', NewsSchema);
export default News;