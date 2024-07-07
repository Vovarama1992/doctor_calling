import { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Slot extends Document {
  id: string;
  date: Date;
  doctor_id: string;
  patient_id: string | null;
}

export const SlotSchema = new Schema<Slot>({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  doctor_id: {
    type: String,
    ref: 'Doctor',
    required: true,
  },
  patient_id: {
    type: String,
    ref: 'Patient',
    default: null,
  },
});

SlotSchema.index({ doctor_id: 1, date: 1 }, { unique: true });
