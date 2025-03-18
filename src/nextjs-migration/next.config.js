
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Добавляем все домены, с которых загружаются изображения
  },
  // Конфигурация окружения API (значения будут заменены на фактические переменные окружения)
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
  },
}

module.exports = nextConfig
