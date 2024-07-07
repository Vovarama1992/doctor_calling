import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Body,
} from '@nestjs/common';
import { SlotsService } from '../services/slots.service';
import { Slot } from '../schemas/slot.schema';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get('doctor/:doctorId')
  async findAvailableByDoctor(
    @Param('doctorId') doctorId: string,
  ): Promise<Slot[]> {
    return this.slotsService.findAvailableByDoctor(doctorId);
  }

  @Get('patient/:telephone')
  async findByPatientTelephone(
    @Param('telephone') telephone: string,
  ): Promise<Slot[]> {
    return this.slotsService.findByPatientTelephone(telephone);
  }

  @Patch(':slotId/book')
  async bookSlot(
    @Param('slotId') slotId: string,
    @Body('patientId') patientId: string,
  ): Promise<Slot> {
    return this.slotsService.bookSlot(slotId, patientId);
  }

  @Patch(':slotId/release')
  async releaseSlot(@Param('slotId') slotId: string): Promise<Slot> {
    return this.slotsService.releaseSlot(slotId);
  }

  @Post()
  async addSlot(
    @Body('date') date: Date,
    @Body('doctorId') doctorId: string,
  ): Promise<Slot> {
    return this.slotsService.addSlot(date, doctorId);
  }

  @Delete(':slotId')
  async deleteSlot(@Param('slotId') slotId: string): Promise<void> {
    return this.slotsService.deleteSlot(slotId);
  }
}
