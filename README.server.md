
# Серверная часть блога о еде

## Настройка базы данных
Для работы сервера требуется PostgreSQL. Настройки подключения хранятся в файле `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=food_blog
```

## Как запустить сервер
Для запуска сервера выполните:
```
node src/server/server.js
```

Сервер запустится на порту 3000 (http://localhost:3000).

## Важное замечание о настройке TypeScript
Серверная часть использует экспериментальные декораторы TypeScript. Файл конфигурации `tsconfig.server.json` настроен соответствующим образом, и скрипт `server.js` компилирует TypeScript-код сервера с правильными параметрами.

## Команды для добавления в package.json
Добавьте следующие скрипты в ваш package.json:
```json
"server": "node src/server/server.js",
"dev:server": "node src/server/server.js",
"dev:all": "concurrently \"npm run dev\" \"npm run dev:server\""
```

## API Endpoints

### Рецепты
- `GET /api/recipes` - получить все рецепты (с опциональной фильтрацией по категории и поиску)
- `GET /api/recipes/:id` - получить рецепт по ID
- `POST /api/recipes` - создать новый рецепт
- `PUT /api/recipes/:id` - обновить существующий рецепт
- `DELETE /api/recipes/:id` - удалить рецепт

### Категории
- `GET /api/recipes/categories` - получить все категории
- `POST /api/recipes/categories` - создать новую категорию

### Теги
- `GET /api/recipes/tags` - получить все теги
- `POST /api/recipes/tags` - создать новый тег
