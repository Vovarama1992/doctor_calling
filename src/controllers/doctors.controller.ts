import { Controller, Get, Query } from '@nestjs/common';
import { DoctorsService } from '../services/doctors.service';
import { Doctor } from '../schemas/doctor.schema';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  async findBySpecialization(@Query('spec') spec: string): Promise<Doctor[]> {
    return this.doctorsService.findBySpecialization(spec);
  }
}
