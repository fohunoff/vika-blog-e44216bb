
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Добавьте здесь все домены, с которых загружаются изображения
  },
  // Настройка среды API (значения будут заменены настоящими env переменными)
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
  },
}

module.exports = nextConfig
