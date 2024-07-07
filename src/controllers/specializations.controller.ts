import { Controller, Get } from '@nestjs/common';
import { SpecializationsService } from '../services/specializations.service';
import { Specialization } from '../schemas/specialization.schema';

@Controller('specializations')
export class SpecializationsController {
  constructor(
    private readonly specializationsService: SpecializationsService,
  ) {}

  @Get()
  async findAll(): Promise<Specialization[]> {
    return this.specializationsService.findAll();
  }
}
