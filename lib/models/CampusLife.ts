import mongoose, { Schema, model, models } from 'mongoose';

export interface ICampusLife {
  _id?: string;
  sectionTitle: string;
  sectionSubtitle: string;
  cardTitle: string;
  cardImage: string;
  cardLink: string;
}

const CampusLifeSchema = new Schema<ICampusLife>(
  {
    sectionTitle: { type: String, default: 'Campus Life' },
    sectionSubtitle: { type: String, default: 'Building a vibrant community of creative and accomplished people from around the world' },
    cardTitle: { type: String, required: true },
    cardImage: { type: String, required: true },
    cardLink: { type: String, default: '#' },
  },
  { timestamps: true }
);

const CampusLife = models.CampusLife || model<ICampusLife>('CampusLife', CampusLifeSchema);

export default CampusLife;