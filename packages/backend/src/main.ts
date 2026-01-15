import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import * as swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();

  const file = readFileSync(path.join(process.cwd(), 'openapi.yaml'), 'utf8');
  const doc = yaml.load(file) as unknown as swaggerUi.JsonObject;
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(doc));

  await app.listen(process.env.PORT ?? 3000).then(() => {
    console.log(`backend running in port ${process.env.PORT ?? 3000}`);
  });
}

bootstrap();
