import { Schema, model, models } from 'mongoose';

const ContactInfoSchema = new Schema(
  {
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    location: { type: String, default: '' },
    openHoursWeekday: { type: String, default: '' }, // e.g., "Monday - Friday: 8:00 am - 5:00 pm"
    openHoursWeekend: { type: String, default: '' }, // e.g., "Saturday - Sunday: 8:00 am - 5:00 pm"
    facebook: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  { timestamps: true }
);

export default models.ContactInfo || model('ContactInfo', ContactInfoSchema);