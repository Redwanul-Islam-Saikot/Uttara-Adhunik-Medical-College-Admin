import mongoose, { Schema, Document } from 'mongoose';

export interface IPDFItem {
  sl: string;
  date: string;
  title: string;
  pdfUrl: string;
}

export interface IPDFDocument extends Document {
  category: 'papers' | 'forms' | 'results'; // Reusable category type
  mainTitle: string;
  subTitle?: string;
  sectionHeader?: string;
  footerNote?: string;
  items: IPDFItem[];
}

const PDFSchema = new Schema<IPDFDocument>(
  {
    category: {
      type: String,
      required: true,
      enum: ['papers', 'forms', 'results'],
      unique: true,
    },
    mainTitle: { type: String, required: true },
    subTitle: { type: String, default: '' },
    sectionHeader: { type: String, default: '' },
    footerNote: { type: String, default: '' },
    items: [
      {
        sl: { type: String, required: true },
        date: { type: String, required: true },
        title: { type: String, required: true },
        pdfUrl: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.PDF || mongoose.model<IPDFDocument>('PDF', PDFSchema);