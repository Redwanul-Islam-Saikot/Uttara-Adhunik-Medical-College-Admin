import mongoose, { Schema, model, models } from 'mongoose';

const HeroSchema = new Schema(
  {
    _id: { type: String, required: true },
    tagline: { type: String },
    titleWhite1: { type: String },
    titleYellow: { type: String },
    titleWhite2: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    programSectionTitle: { type: String },
    programs: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
    bgImage: { type: String },
  },
  { 
    timestamps: true,
    _id: false // Mongoose কে অটো ObjectId জেনারেট করতে বাধা দেয়
  }
);

export const Hero = models.Hero || model('Hero', HeroSchema);
export default Hero;