import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { PatientsService } from '../services/patients.service';
import { Patient } from '../schemas/patient.schema';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async findPatient(
    @Query('telephone') telephone: string,
    @Query('chatId') chatId: number,
  ): Promise<{ found: boolean; patient: Patient }> {
    return this.patientsService.findPatient(telephone, chatId);
  }

  @Post()
  async createPatient(
    @Body('telephone') telephone: string,
    @Body('name') name: string,
    @Body('chatId') chatId: number,
  ): Promise<Patient> {
    return this.patientsService.createPatient(telephone, name, chatId);
  }

  @Get('all')
  async getAllPatients(): Promise<Patient[]> {
    return this.patientsService.getAllPatients();
  }
}
