import mongoose, { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
});

const SubSectionSchema = new Schema({
  sectionTitle: { type: String, default: '' },
  items: [ItemSchema],
});

const MedicalEducationUnitSchema = new Schema(
  {
    titlePrefix: { type: String, default: '' },
    titleHighlight: { type: String, default: '' },
    subTitle: { type: String, default: '' },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    mainImage: { type: String, default: '' },
    footerNote: { type: String, default: '' },
    subSections: [SubSectionSchema],
  },
  { timestamps: true, strict: false }
);

// মডেল এবং কালেকশনের নাম 'me_units' নির্দিষ্ট করে দেওয়া হলো
export default models.MedicalEducationUnit || 
  model('MedicalEducationUnit', MedicalEducationUnitSchema, 'me_units');