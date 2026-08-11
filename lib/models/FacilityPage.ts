import mongoose, { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
});

const SubSectionSchema = new Schema({
  sectionTitle: { type: String, default: '' },
  items: [ItemSchema],
});

const FacilityPageSchema = new Schema(
  {
    pageSlug: { type: String, required: true, unique: true }, // e.g., 'training', 'seminar', 'hostel', 'laboratory', 'cafeteria'
    logo: { type: String, default: '' },
    titlePrefix: { type: String, default: '' },
    titleHighlight: { type: String, default: '' },
    subTitleBold: { type: String, default: '' },
    subTitleNormal: { type: String, default: '' },
    descriptionBold: { type: String, default: '' },
    descriptionNormal: { type: String, default: '' },
    image1: { type: String, default: '' },
    image2: { type: String, default: '' },
    subSections: [SubSectionSchema],
  },
  { timestamps: true, strict: false }
);

export default models.FacilityPage || model('FacilityPage', FacilityPageSchema);