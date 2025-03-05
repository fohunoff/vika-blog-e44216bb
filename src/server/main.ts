
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  
  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}

bootstrap();
