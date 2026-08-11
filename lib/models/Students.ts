import mongoose, { Schema, Document } from 'mongoose';

export interface IFeeItem {
  sl: string;
  particulars: string;
  amount: string;
}

export interface ISubSection {
  title: string;
  content?: string;
  bulletPoints?: string[];
}

export interface IStudentCategory {
  categoryTitle: string; // e.g. "For BD/National Student"
  subSections: ISubSection[];
  highlightNote?: string;
  feeSessionTitle?: string; // e.g. "Fee Structure (Session 2024-2025)"
  fees: IFeeItem[];
  totalPayable?: string;
  additionalNotes?: string[];
}

export interface IStudents extends Document {
  categories: IStudentCategory[];
  contactInfo: {
    title: string;
    collegeName: string;
    address: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const FeeItemSchema = new Schema<IFeeItem>({
  sl: { type: String, required: true },
  particulars: { type: String, required: true },
  amount: { type: String, required: true },
});

const SubSectionSchema = new Schema<ISubSection>({
  title: { type: String, required: true },
  content: { type: String },
  bulletPoints: [{ type: String }],
});

const StudentCategorySchema = new Schema<IStudentCategory>({
  categoryTitle: { type: String, required: true },
  subSections: [SubSectionSchema],
  highlightNote: { type: String },
  feeSessionTitle: { type: String },
  fees: [FeeItemSchema],
  totalPayable: { type: String },
  additionalNotes: [{ type: String }],
});

const StudentsSchema = new Schema<IStudents>(
  {
    categories: [StudentCategorySchema],
    contactInfo: {
      title: { type: String, default: 'Contact for Admission' },
      collegeName: { type: String, default: '' },
      address: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Students || mongoose.model<IStudents>('Students', StudentsSchema);