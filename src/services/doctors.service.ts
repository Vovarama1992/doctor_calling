import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from '../schemas/doctor.schema';

@Injectable()
export class DoctorsService {
  constructor(@InjectModel('Doctor') private doctorModel: Model<Doctor>) {}

  async findBySpecialization(spec: string): Promise<Doctor[]> {
    return this.doctorModel.find({ spec }).exec();
  }
}
