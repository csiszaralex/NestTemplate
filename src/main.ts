import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  config();
  const logger = new Logger('START');
  const swaggerConf = new DocumentBuilder()
    .setTitle('Covid tracker')
    .setDescription('A Covid-Tracker API-jának dokumentációja swagger segítségével.')
    .setVersion('1.0')
    .build();

  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConf);
  SwaggerModule.setup(process.env.SWAGGER_LINK || 'swagger', app, swaggerDoc);

  await app.listen(process.env.PORT || 3000, () => {
    logger.debug('----------------------------------------------------');
  });
}
bootstrap();
