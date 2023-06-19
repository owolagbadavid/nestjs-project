import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { configuration } from './config/configuration';

async function bootstrap() {
  const appConfig = configuration().app;
  const secret = appConfig.secret;
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .addCookieAuth('token')
    .setTitle('CashAdvNRtr')
    .setDescription('Documentation')
    .setVersion('1.0')
    .build();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api');
  app.use(cookieParser(secret));

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
