import { NestFactory } from '@nestjs/core';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import { VersioningType } from '@nestjs/common';
import morgan from 'morgan';

export async function bootstrap(): Promise<NestExpressApplication> {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
  );

  // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, ...)
  app.enable('trust proxy');
  // private headers
  app.use(helmet());
  // add prefix api to all routes
  app.setGlobalPrefix('api');
  // compression payload
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(compression());

  app.use(morgan('combined'));
  // add versioning to all routes
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(process.env.PORT ?? 3000);
  return app;
}
export const viteNodeApp = bootstrap();
