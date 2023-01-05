import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT || "3000", 10);
  await app.listen(port);
  console.log(`App running on port: ${port}`);
}
bootstrap();
