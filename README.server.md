
# Серверная часть блога о еде и дневника

## Примечание о серверной части
В настоящий момент мы используем Express сервер с PostgreSQL базой данных. Исходный код NestJS сохранен в репозитории для будущей миграции.

## Как запустить сервер
Для запуска сервера выполните:
```
node src/server/server.js
```

Сервер запустится на порту 3000 (http://localhost:3000).

## Настройка PostgreSQL

Перед запуском убедитесь, что PostgreSQL установлен и запущен. Создайте базу данных и настройте параметры подключения в .env файле:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=food_blog
```

### Для macOS:

Найдите, какой пользователь уже существует (обычно это ваш системный пользователь):
```bash
psql -l
```

Если эта команда работает, запомните имя пользователя, с которым подключились.
Войдите в PostgreSQL с существующим пользователем:
```bash
psql postgres
```

Или, если знаете другого пользователя:
```bash
psql -U имя_пользователя postgres
```

Создайте роль postgres, если она отсутствует:
```sql
CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'yourpassword';
```

## API Endpoints

### Рецепты
- `GET /api/recipes` - получить все рецепты (с опциональной фильтрацией по категории и поиску)
- `GET /api/recipes/:id` - получить рецепт по ID
- `GET /api/recipes/categories` - получить все категории
- `GET /api/recipes/tags` - получить все теги

### Дневник
- `GET /api/diaries` - получить все записи дневника (с опциональной фильтрацией по поиску и настроению)
- `GET /api/diaries/:id` - получить запись дневника по ID
- `GET /api/diaries/moods` - получить все настроения
- `GET /api/diaries/tags` - получить все теги с количеством использований

## Команды для добавления в package.json
Добавьте следующие скрипты в ваш package.json:
```json
"server": "node src/server/server.js",
"dev:server": "node src/server/server.js",
"dev:all": "concurrently \"npm run dev\" \"npm run dev:server\""
```

## Технические примечания
- Используется TypeScript версии 4.9.5 для поддержки экспериментальных декораторов
- PostgreSQL используется в качестве СУБД
- Express.js используется для API endpoints
- В будущем планируется полная миграция на NestJS
