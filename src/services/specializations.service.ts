import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Specialization } from '../schemas/specialization.schema';

@Injectable()
export class SpecializationsService {
  constructor(
    @InjectModel('Specialization')
    private specializationModel: Model<Specialization>,
  ) {}

  async findAll(): Promise<Specialization[]> {
    return this.specializationModel.find().exec();
  }
}
