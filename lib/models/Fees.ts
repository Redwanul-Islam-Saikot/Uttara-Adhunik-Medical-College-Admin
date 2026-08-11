import mongoose, { Schema, models, model } from 'mongoose';

const FeesSchema = new Schema(
  {
    titleGreen: { type: String, required: true }, // e.g. "Admission"
    titleBlack: { type: String, required: true }, // e.g. "Procedure & Fees"
    descBold: { type: String, default: '' },       // Bold text segment
    descNormal: { type: String, default: '' },     // Normal description text
    badgeText: { type: String, default: '' },      // e.g. "Admission ___"
    logoUrl: { type: String, default: '' },        // Left green icon
    imageUrl: { type: String, default: '' },       // Main banner image
  },
  { timestamps: true }
);

export default models.Fees || model('Fees', FeesSchema);