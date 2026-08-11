import { Schema, model, models } from 'mongoose';

const DepartmentSectionSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    searchPlaceholder: { type: String, default: '' },
    popularSearchTags: { type: [String], default: [] },
    popularProgramTitle: { type: String, default: '' },
    popularProgramImage: { type: String, default: '' },
    badgeValue: { type: String, default: '' },
    badgeLabel: { type: String, default: '' },
    badgeLogo: { type: String, default: '' }, // New Badge Logo Field
    imageRight1: { type: String, default: '' },
    imageRight2: { type: String, default: '' },
  },
  { timestamps: true }
);

export default models.DepartmentSection || model('DepartmentSection', DepartmentSectionSchema);