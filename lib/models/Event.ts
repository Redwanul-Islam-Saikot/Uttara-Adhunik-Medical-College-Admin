import mongoose, { Schema, model, models } from 'mongoose';

const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const Event = models.Event || model('Event', EventSchema);