import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = Number(process.env.API_PORT || 4000);
  await app.listen(port);
  console.log(`API @ http://localhost:${port}`);
}
bootstrap();
