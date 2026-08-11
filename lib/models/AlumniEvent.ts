import mongoose, { Schema, model, models } from 'mongoose';

export interface IAlumniEvent {
  _id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  eventImage?: string;
  link?: string;
}

const AlumniEventSchema = new Schema<IAlumniEvent>(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    eventImage: { type: String, default: '' },
    link: { type: String, default: '#' },
  },
  { timestamps: true }
);

const AlumniEvent = models.AlumniEvent || model<IAlumniEvent>('AlumniEvent', AlumniEventSchema);

export default AlumniEvent;