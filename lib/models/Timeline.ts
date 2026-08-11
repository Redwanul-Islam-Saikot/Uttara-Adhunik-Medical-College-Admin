import mongoose, { Schema, model, models } from 'mongoose';

const TimelineItemSchema = new Schema(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

const TimelineHeaderSchema = new Schema(
  {
    mainTitle: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export const TimelineItem = models.TimelineItem || model('TimelineItem', TimelineItemSchema);
export const TimelineHeader = models.TimelineHeader || model('TimelineHeader', TimelineHeaderSchema);