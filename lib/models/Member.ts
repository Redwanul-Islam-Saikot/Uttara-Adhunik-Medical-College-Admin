import mongoose, { Schema, Document } from 'mongoose';

export interface IMember extends Document {
  name: string;
  designation: string;
  image: string;
  category: 'founder' | 'ec' | 'gb';
  order: number;
  createdAt: Date;
}

const MemberSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: ['founder', 'ec', 'gb'],
      required: true,
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);