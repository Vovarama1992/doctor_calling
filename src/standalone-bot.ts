import { Telegraf } from 'telegraf';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { throwError } from 'rxjs';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string);
const BASE_URL = 'http://localhost:3000';

interface UserState {
  phoneNumber?: string;
  name?: string;
  specId?: string;
  doctorId?: string;
}

const userState: { [key: number]: UserState } = {};

bot.start((ctx) => {
  const userId = ctx.from?.id!;
  userState[userId] = {};
  ctx.reply('Привет! Пожалуйста, введите ваш номер телефона:');
});

bot.on('text', async (ctx) => {
  const userId = ctx.from?.id!;
  console.log('userId: ' + userId);
  const userMessage = ctx.message.text;

  if (!userState[userId].phoneNumber) {
    userState[userId].phoneNumber = userMessage;
    try {
      const response = await axios.get(`${BASE_URL}/patients`, {
        params: { telephone: userMessage, chatId: userId },
      });
      console.log('response data: ' + JSON.stringify(response.data));
      const patient = response.data.patient;
      if (patient.name) {
        console.log('patient name exists');
      } else {
        console.log('name doesnt exist');
        const keys = Object.keys(patient);
        console.log(JSON.stringify(keys));
      }
      if (patient.name) {
        console.log('true: ' + patient.name);
        ctx.reply(`Привет, ${patient.name}!`);
        askForSpecialization(ctx);
      } else {
        ctx.reply('Пожалуйста, введите ваше имя:');
      }
    } catch (error) {
      ctx.reply('Пожалуйста, введите ваше имя:');
    }
  } else if (!userState[userId].name) {
    userState[userId].name = userMessage;
    try {
      await axios.post(`${BASE_URL}/patients`, {
        telephone: userState[userId].phoneNumber,
        name: userMessage,
        chatId: userId,
      });
      ctx.reply(`Привет, ${userMessage}!`);
      askForSpecialization(ctx);
    } catch (error) {
      console.error(error);
      ctx.reply('Произошла ошибка при сохранении данных. Попробуйте снова.');
    }
  }
});

const askForSpecialization = async (ctx: any) => {
  try {
    const response = await axios.get(`${BASE_URL}/specializations`);
    const buttons = response.data.map((spec: any) => ({
      text: spec.name,
      callback_data: `spec_${spec.name}`,
    }));
    ctx.telegram.sendMessage(ctx.chat.id, 'Выберите специализацию:', {
      reply_markup: {
        inline_keyboard: [buttons],
      },
    });
  } catch (error) {
    console.error(error);
    ctx.reply('Произошла ошибка при получении данных. Попробуйте снова.');
  }
};

const askForDoctor = async (ctx: any, specialization: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/doctors`, {
      params: { spec: specialization },
    });

    const buttons = response.data.map((doc: any) => ({
      text: doc.name,
      callback_data: `doctor_${doc.id}`, // Добавляем префикс
    }));

    ctx.telegram.sendMessage(ctx.chat.id, 'Выберите врача:', {
      reply_markup: {
        inline_keyboard: [buttons],
      },
    });
  } catch (error) {
    console.error(error);
    ctx.reply('Произошла ошибка при получении данных. Попробуйте снова.');
  }
};

bot.action(/spec_(.+)/, async (ctx) => {
  const specId = ctx.match[1];
  await askForDoctor(ctx, specId);
});

bot.action(/doctor_(.+)/, async (ctx) => {
  const doctorId = ctx.match[1];
  const userId = ctx.from?.id!;
  userState[userId].doctorId = doctorId;

  try {
    const response = await axios.get(`${BASE_URL}/slots/doctor/${doctorId}`);

    const buttons = response.data.map((slot: any) => ({
      text: new Date(slot.date).toLocaleString(),
      callback_data: `slot_${slot.id}`,
    }));

    ctx.telegram.sendMessage(ctx.chat.id, 'Выберите время приема:', {
      reply_markup: {
        inline_keyboard: [buttons],
      },
    });
  } catch (error) {
    console.error(error);
    ctx.reply('Произошла ошибка при получении данных. Попробуйте снова.');
  }
});

bot.action(/slot_(.+)/, async (ctx) => {
  const slotId = ctx.match[1];
  const userId = ctx.from?.id!;
  const { phoneNumber } = userState[userId];

  try {
    const patientResponse = await axios.get(`${BASE_URL}/patients`, {
      params: { telephone: phoneNumber },
    });
    const patient = patientResponse.data;

    await axios.patch(`${BASE_URL}/slots/${slotId}/book`, {
      patientId: patient.id,
    });

    ctx.reply('Вы успешно записались на прием!');
    notifyAllPatients(ctx, patient, slotId);
  } catch (error) {
    console.error(error);
    ctx.reply('Произошла ошибка при записи на прием. Попробуйте снова.');
  }
});

const notifyAllPatients = async (ctx: any, patient: any, slotId: string) => {
  try {
    const slotResponse = await axios.get(`${BASE_URL}/slots/${slotId}`);
    const slot = slotResponse.data;

    const doctorResponse = await axios.get(`${BASE_URL}/doctors`, {
      params: { id: slot.doctor_id },
    });
    const doctor = doctorResponse.data;

    const message = `Пациент ${patient.name} записался на прием к ${doctor.name} на ${new Date(slot.date).toLocaleString()}`;

    const patientsResponse = await axios.get(`${BASE_URL}/patients`);
    const patients = patientsResponse.data;

    patients.forEach((p: any) => {
      if (p.telegramChatId && p.telegramChatId !== ctx.from?.id) {
        bot.telegram.sendMessage(p.telegramChatId, message);
      }
    });
  } catch (error) {
    console.error('Ошибка при отправке уведомления:', error);
  }
};

bot.launch();
console.log('Telegram bot is running... https://t.me/doctor_call_doctor_bot');
