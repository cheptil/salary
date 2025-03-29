const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Чтобы Express мог парсить JSON в теле запроса:
app.use(express.json());

// Раздача статических файлов из текущей папки.
// Это позволит открыть в браузере http://localhost:3000/index.html
app.use(express.static(__dirname));

// Обработчик POST /save-results
app.post('/save-results', (req, res) => {
  const userData = req.body;
  
  // Если клиентский код передаёт userData.fileName, используем его.
  // Иначе сохраняем в data.json (или можно кинуть ошибку).
  const requestedFileName = userData.fileName || 'data.json';
  
  // Абсолютный путь к файлу
  const filePath = path.join(__dirname, requestedFileName);

  // На всякий случай создадим директорию, если её нет:
  const dirForFile = path.dirname(filePath);
  if (!fs.existsSync(dirForFile)) {
    fs.mkdirSync(dirForFile, { recursive: true });
  }

  try {
    // Сохраняем данные
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf8');
    // Возвращаем ответ
    res.json({
      success: true,
      message: 'Data saved!',
      savedPath: requestedFileName
    });
  } catch (err) {
    console.error('Ошибка при сохранении файла:', err);
    res.status(500).json({
      success: false,
      message: 'Ошибка при сохранении файла'
    });
  }
});

// Запуск сервера на порте 3000
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
