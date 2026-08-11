// models/Publication.ts
import mongoose, { Schema, model, models } from 'mongoose';

const PublicationSchema = new Schema(
  {
    title: { type: String, required: true },
    day: { type: String, required: true },
    monthYear: { type: String, required: true },
    time: { type: String, required: true },
    pdfUrl: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Journal', 'Tenders'],
      required: true,
    },
  },
  { timestamps: true }
);

export const Publication = models.Publication || model('Publication', PublicationSchema);