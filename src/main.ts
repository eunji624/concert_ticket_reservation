import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('testPJ 안녕하세요오오우오오오오')
    .setDescription(`testPJ 안녕하세요오오우오오오오`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, customOptions);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //컨트롤러에서 유저의 입력값을 자동으로 DTO 객체로 변환해주는 옵션
    }),
  );
  await app.listen(3001);
}
bootstrap();
