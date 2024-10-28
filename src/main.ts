import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config'
import { Logger } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server')



  app.enableCors(); // Enable CORS for all origins

  const port = process.env.Port || serverConfig.port;
  await app.listen(port);
  Logger.log(`Application listening on port ${port}`)
}
bootstrap();
