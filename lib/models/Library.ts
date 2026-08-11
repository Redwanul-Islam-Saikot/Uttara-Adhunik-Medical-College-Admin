import mongoose, { Schema, models, model } from 'mongoose';

const LibrarySchema = new Schema(
  {
    openHours: { type: String, default: '8:00AM - 9:00PM' },
    studyAreas: { type: String, default: 'Separate Study Area' },
    titlePrefix: { type: String, default: 'About the' },
    titleHighlight: { type: String, default: 'Library' },
    logo: { type: String, required: true },
    image: { type: String, required: true },
    boldDescription: { type: String, required: true },
    normalDescription: { type: String, required: true },
    totalBooks: { type: String, default: '3,371+' },
    totalJournals: { type: String, default: '1,187+' },
    bottomNote: { type: String, default: '' },
  },
  { timestamps: true }
);

export default models.Library || model('Library', LibrarySchema);