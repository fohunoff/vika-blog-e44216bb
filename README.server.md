
# Серверная часть блога о еде

## Примечание о серверной части
В настоящий момент мы используем упрощенную реализацию сервера на Node.js с mock-данными вместо полной реализации на NestJS из-за проблем с TypeScript декораторами. В будущем планируется полная миграция на NestJS.

## Как запустить сервер
Для запуска сервера выполните:
```
node src/server/server.js
```

Сервер запустится на порту 3000 (http://localhost:3000).

## API Endpoints

### Рецепты
- `GET /api/recipes` - получить все рецепты (с опциональной фильтрацией по категории и поиску)
- `GET /api/recipes/:id` - получить рецепт по ID

### Категории
- `GET /api/recipes/categories` - получить все категории

### Теги
- `GET /api/recipes/tags` - получить все теги

## Команды для добавления в package.json
Добавьте следующие скрипты в ваш package.json:
```json
"server": "node src/server/server.js",
"dev:server": "node src/server/server.js",
"dev:all": "concurrently \"npm run dev\" \"npm run dev:server\""
```
