import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Slot } from '../schemas/slot.schema';

@Injectable()
export class SlotsService {
  constructor(@InjectModel('Slot') private slotModel: Model<Slot>) {}

  async findAvailableByDoctor(doctor_id: string): Promise<Slot[]> {
    return this.slotModel.find({ doctor_id, patient_id: null }).exec();
  }

  async findByPatientTelephone(telephone: string): Promise<Slot[]> {
    const slots = await this.slotModel
      .find()
      .populate({
        path: 'patient_id',
        match: { telephone },
        select: 'id',
      })
      .exec();

    return slots.filter((slot) => slot.patient_id !== null);
  }

  async bookSlot(slot_id: string, patient_id: string): Promise<Slot> {
    const slot = await this.slotModel.findOneAndUpdate(
      { id: slot_id, patient_id: null },
      { patient_id },
      { new: true },
    );
    if (!slot) {
      throw new Error('Slot not available or already booked');
    }
    return slot;
  }

  async releaseSlot(slot_id: string): Promise<Slot> {
    const slot = await this.slotModel.findOneAndUpdate(
      { id: slot_id },
      { patient_id: null },
      { new: true },
    );
    if (!slot) {
      throw new Error('Slot not found');
    }
    return slot;
  }

  async addSlot(date: Date, doctor_id: string): Promise<Slot> {
    const newSlot = new this.slotModel({ date, doctor_id });
    return newSlot.save();
  }

  async deleteSlot(slot_id: string): Promise<void> {
    await this.slotModel.findByIdAndDelete(slot_id).exec();
  }
}
