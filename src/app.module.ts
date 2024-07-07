import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PatientsController } from './controllers/patients.controller';
import { SpecializationsController } from './controllers/specializations.controller';
import { DoctorsController } from './controllers/doctors.controller';
import { SlotsController } from './controllers/slots.controller';
import { PatientsService } from './services/patients.service';
import { SpecializationsService } from './services/specializations.service';
import { DoctorsService } from './services/doctors.service';
import { SlotsService } from './services/slots.service';
import { PatientSchema } from './schemas/patient.schema';
import { SpecializationSchema } from './schemas/specialization.schema';
import { DoctorSchema } from './schemas/doctor.schema';
import { SlotSchema } from './schemas/slot.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: 'Patient', schema: PatientSchema },
      { name: 'Specialization', schema: SpecializationSchema },
      { name: 'Doctor', schema: DoctorSchema },
      { name: 'Slot', schema: SlotSchema },
    ]),
  ],
  controllers: [
    PatientsController,
    SpecializationsController,
    DoctorsController,
    SlotsController,
  ],
  providers: [
    PatientsService,
    SpecializationsService,
    DoctorsService,
    SlotsService,
  ],
})
export class AppModule {}
