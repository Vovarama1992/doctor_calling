import { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Specialization extends Document {
  id: string;
  name: string;
}

export const SpecializationSchema = new Schema<Specialization>({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
});
