import { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Doctor extends Document {
  id: string;
  name: string;
  spec: string;
}

export const DoctorSchema = new Schema<Doctor>({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  spec: {
    type: String,
    required: true,
  },
});
