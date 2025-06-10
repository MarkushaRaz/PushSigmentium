import express from 'express';
import webpush from 'web-push';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка VAPID-ключей
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.PUBLIC_KEY,
  process.env.PRIVATE_KEY
);

app.use(cors());
app.use(express.json());

// Хранение подписок (в памяти, можно заменить на БД)
const subscriptions = [];

app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  // Добавляем, если ещё нет
  if (!subscriptions.find(sub => sub.endpoint === subscription.endpoint)) {
    subscriptions.push(subscription);
    console.log('Добавлена подписка:', subscription.endpoint);
  }

  res.status(201).json({ message: 'OK' });
});

app.post('/notify', async (req, res) => {
  const payload = JSON.stringify({
    title: req.body.title || 'Уведомление',
    message: req.body.message || 'Тестовое уведомление'
  });

  const results = await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification(sub, payload).catch(err => {
        console.error('Ошибка уведомления:', err);
      })
    )
  );

  res.json({ sent: results.length });
});

app.get('/', (req, res) => {
  res.send('Push-сервер работает');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
