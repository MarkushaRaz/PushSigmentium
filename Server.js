const webpush = require('web-push');

// Установите VAPID ключи
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:example@domain.com',
  publicKey,
  privateKey
);

// Пример отправки уведомлений на всех клиентов
const send = () => {
  // В данном случае мы не храним подписки, и не отправляем их
  // Используем Service Worker для получения уведомлений.
  const notificationPayload = JSON.stringify({
    title: 'Новое уведомление!',
    message: 'У вас новое сообщение.'
  });

  // Пример отправки уведомления
  webpush.sendNotification(subscription, notificationPayload)
    .then(response => {
      console.log('Уведомление отправлено:', response);
    })
    .catch(error => {
      console.log('Ошибка при отправке уведомления:', error);
    });
};

setInterval(send, 30000);
