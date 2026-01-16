# test_project
https://claude.ai/share/2bbcedbe-1cbc-4b4a-b57f-5f1c1ffeaf01

## Запуск приложения с PM2 в режиме кластера

Для запуска приложения с помощью PM2 в режиме кластера с 2 инстансами и объединением логов:

### 1. Установка PM2
```bash
npm install -g pm2
```

### 2. Запуск в режиме кластера
```bash
pm2 start bin/www --name "test-app" -i 2 --merge-logs
```

### 3. Проверка статуса
```bash
pm2 status
pm2 logs
```

### 4. Остановка приложения
```bash
pm2 stop test-app
pm2 delete test-app
```

### Параметры команды:
- `bin/www` - точка входа приложения
- `--name "test-app"` - имя процесса в PM2
- `-i 2` - количество инстансов (2)
- `--merge-logs` - объединение логов всех инстансов

### Проверка работы:
```bash
curl http://localhost:3000
```

1. Для конкретного роута в routes/index.js:
   // Middleware только для /hello
   router.get('/hello',
   (req, res, next) => {
   const timestamp = new Date().toISOString();
   console.log(`[${timestamp}] ${req.method} 
  ${req.url}`);
   next();
   },
   function(req, res) {
   res.json({ message: "Hello, World!" });
   }
   );

2. Для нескольких рутов:
   // Создать функцию middleware
   function logRequest(req, res, next) {
   const timestamp = new Date().toISOString();
   console.log(`[${timestamp}] ${req.method} 
  ${req.url}`);
   next();
   }

// Применить к нужным рутам
router.get('/hello', logRequest, function(req, res)
{ /* ... */ });
router.get('/greet', logRequest, function(req, res)
{ /* ... */ });

3. Для всех рутов определенного типа:
   // Только для GET запросов
   router.use((req, res, next) => {
   if (req.method === 'GET') {
   const timestamp = new Date().toISOString();
   console.log(`[${timestamp}] ${req.method} 
  ${req.url}`);
   }
   next();
   });
