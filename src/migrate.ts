import mongoose from 'mongoose';
import { runMigration } from './migrations/initial-seed'; // Убедитесь, что путь правильный
import Migration from './migration.schema';

const mongoURI = 'mongodb://localhost:27017/clinic';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

const clearMigrationState = async () => {
  try {
    await Migration.deleteMany({});
    console.log('Migration state cleared');
  } catch (err) {
    console.error('Error clearing migration state:', err);
  }
};

const checkAndRunMigration = async (
  migrationName: string,
  migrationFunction: () => Promise<void>,
) => {
  try {
    const migration = await Migration.findOne({ name: migrationName });
    if (!migration) {
      await migrationFunction();
      const newMigration = new Migration({ name: migrationName });
      await newMigration.save();
      console.log(`Migration ${migrationName} executed and recorded`);
    } else {
      console.log(`Migration ${migrationName} already executed`);
    }
  } catch (err) {
    console.error('Error during migration:', err);
  }
};

const runMigrations = async () => {
  await connectDB();
  await clearMigrationState();
  await checkAndRunMigration('2024-07-07-initial-seed', runMigration);
  mongoose.connection.close();
};

runMigrations().catch((err) => console.error('Migration failed:', err));
