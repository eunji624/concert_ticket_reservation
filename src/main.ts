import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //컨트롤러에서 유저의 입력값을 자동으로 DTO 객체로 변환해주는 옵션
    }),
  );
  await app.listen(3001);
}
bootstrap();
