import mongoose, { Schema, Document } from 'mongoose';

export interface IMigration extends Document {
  name: string;
  date: Date;
}

export const MigrationSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Migration = mongoose.model<IMigration>('Migration', MigrationSchema);

export default Migration;
