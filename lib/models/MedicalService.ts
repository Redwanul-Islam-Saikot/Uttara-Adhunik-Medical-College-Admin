import mongoose, { Schema, model, models } from 'mongoose';

const MedicalServiceSchema = new Schema(
  {
    categoryNumber: { type: String, required: true }, // e.g., '01', '02'
    categoryTitle: { type: String, required: true },  // e.g., 'MEDICAL SERVICES', 'MEDICINE RELATED'
    categoryGroup: { type: String, default: 'main' }, // 'main', 'clinical_medicine', 'clinical_surgical'
    title: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },            // Logo/Icon (Base64 or Image URL)
  },
  { timestamps: true }
);

export default models.MedicalService || model('MedicalService', MedicalServiceSchema);