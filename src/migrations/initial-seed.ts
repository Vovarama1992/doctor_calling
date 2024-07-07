import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { PatientSchema } from '../schemas/patient.schema';
import { SpecializationSchema } from '../schemas/specialization.schema';
import { DoctorSchema } from '../schemas/doctor.schema';
import { SlotSchema } from '../schemas/slot.schema';

const Patient = mongoose.model('Patient', PatientSchema);
const Specialization = mongoose.model('Specialization', SpecializationSchema);
const Doctor = mongoose.model('Doctor', DoctorSchema);
const Slot = mongoose.model('Slot', SlotSchema);

const specializations = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Oncology',
  'Radiology',
  'Psychiatry',
  'Ophthalmology',
];

const getRandomSpecialization = () => {
  return specializations[Math.floor(Math.random() * specializations.length)];
};

const getRandomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const seedSpecializations = async () => {
  await Specialization.deleteMany({});
  const specializationDocs = specializations.map((spec) => ({
    id: uuidv4(),
    name: spec,
  }));
  await Specialization.insertMany(specializationDocs);
  console.log('Specializations seeded');
};

const seedDoctors = async () => {
  await Doctor.deleteMany({});
  const doctors = [];
  for (let i = 1; i <= 10; i++) {
    doctors.push(
      new Doctor({
        id: uuidv4(),
        name: `Doctor ${i}`,
        spec: getRandomSpecialization(),
      }),
    );
  }
  await Doctor.insertMany(doctors);
  console.log('Doctors seeded');
};

 const seedSlots = async () => {
  await Slot.deleteMany({});

  const doctorIds = (await Doctor.find()).map((doc) => doc.id);
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 30);

  const slots = [];
  for (let i = 0; i < 50; i++) {
    const randomDoctorId =
      doctorIds[Math.floor(Math.random() * doctorIds.length)];
    slots.push(
      new Slot({
        id: uuidv4(),
        date: getRandomDate(startDate, endDate),
        doctor_id: randomDoctorId,
        patient_id: null,
      }),
    );
  }
  await Slot.insertMany(slots);
  console.log('Slots seeded');
};

const beforeTwoHours = async () => {
  await Slot.deleteMany({});
  const doctors = await Doctor.find();
  const currentDate = new Date();

  const slots = doctors.map((doctor: any) => {
    const slotDate = new Date(
      currentDate.getTime() + 2 * 60 * 60 * 1000 + 10 * 60 * 1000,
    ); // +2 часа 10 минут
    return new Slot({
      id: uuidv4(),
      date: slotDate,
      doctor_id: doctor.id,
      patient_id: null,
    });
  });

  await Slot.insertMany(slots);
  console.log('added slots to check');
};

export const runMigration = async () => {
  
  await seedSpecializations();
  await seedDoctors();
  await seedSlots();
  await beforeTwoHours();
  console.log('Migration completed');
};
