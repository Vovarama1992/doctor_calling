import { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Patient extends Document {
  id: string;
  telephone: string;
  name: string;
  telegramChatId: number;
}

export const PatientSchema = new Schema<Patient>({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  name: {
    type: String,
    required: true,
  },
  telegramChatId: {
    type: Number,
    required: true,
  },
});
