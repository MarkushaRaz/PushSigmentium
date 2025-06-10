// server.js
const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Для парсинга JSON
app.use(bodyParser.json());

// Устанавливаем VAPID ключи
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:example@domain.com',
  publicKey,
  privateKey
);

// Массив для хранения подписок (в реальном проекте — лучше использовать БД)
let subscriptions = [];

// Эндпоинт для подписки
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  console.log('Новая подписка:', subscription);
  res.status(201).json({ message: 'Подписка добавлена!' });
});

// Эндпоинт для отправки уведомлений
app.post('/sendNotification', (req, res) => {
  const notificationPayload = req.body;

  const notificationPromises = subscriptions.map(subscription =>
    webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
  );

  Promise.all(notificationPromises)
    .then(() => res.status(200).json({ message: 'Уведомление отправлено!' }))
    .catch(err => {
      console.error('Ошибка отправки уведомлений:', err);
      res.sendStatus(500);
    });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
