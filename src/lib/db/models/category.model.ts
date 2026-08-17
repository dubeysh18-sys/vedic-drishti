import mongoose, { Schema, Document } from "mongoose";

export interface CategoryDocument extends Document {
  id: string;
  name: string;
  description: string;
  chapters: number[];
  coreThemes: string[];
}

const CategorySchema = new Schema<CategoryDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    chapters: [{ type: Number }],
    coreThemes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Category =
  mongoose.models.Category || mongoose.model<CategoryDocument>("Category", CategorySchema);
