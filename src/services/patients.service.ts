import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from '../schemas/patient.schema';

@Injectable()
export class PatientsService {
  constructor(@InjectModel('Patient') private patientModel: Model<Patient>) {}

  async findPatient(
    telephone: string,
    chatId: number,
  ): Promise<{ found: boolean; patient: Patient }> {
    const patient = await this.patientModel.findOne({ telephone }).exec();
    if (!patient) {
      return { found: false, patient: null };
    }
    patient.telegramChatId = chatId;
    await patient.save();
    return { found: true, patient };
  }

  async createPatient(
    telephone: string,
    name: string,
    chatId: number,
  ): Promise<Patient> {
    const patient = new this.patientModel({
      telephone,
      name,
      telegramChatId: chatId,
    });
    await patient.save();
    return patient;
  }

  async getAllPatients(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }
}
