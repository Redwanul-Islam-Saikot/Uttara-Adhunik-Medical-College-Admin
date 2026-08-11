import mongoose, { Schema, models, model } from 'mongoose';

const DepartmentSchema = new Schema(
  {
    title: { type: String, required: true },
    establishedDate: { type: String, required: true },
    image: { type: String, required: true },
    btnLink: { type: String, default: '#' },
  },
  { timestamps: true }
);

const Department = models.Department || model('Department', DepartmentSchema);

export default Department;