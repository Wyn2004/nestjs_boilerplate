import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import {
  ClassSerializerInterceptor,
  ExceptionFilter,
  NestInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import * as morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { AllConfigType } from '@configs/config.type';
import validationOptions from '@utils/validation-option';
import { ResolvePromisesInterceptor } from '@utils/serializer.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { DataSource } from 'typeorm';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const dataSource = app.get(DataSource);
  await dataSource.runMigrations();

  const configService = app.get(ConfigService<AllConfigType>);
  const reflector = app.get(Reflector);

  // enable shutdown hooks to gracefully shutdown the app
  app.enableShutdownHooks();

  // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, ...)
  app.enable('trust proxy');

  // private headers
  app.use(helmet());

  // compression payload
  app.use(compression());

  // log all requests
  app.use(morgan('combined'));

  // add prefix api to all routes, ignore root route
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  // add versioning to all routes
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // global exception filter
  app.useGlobalFilters(
    new GlobalExceptionFilter(configService) as unknown as ExceptionFilter,
  );

  // auto validate DTO base on decorator
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  // resolve promises in responses
  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor() as NestInterceptor,
    new ClassSerializerInterceptor(reflector),
  );

  // config swagger
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
      schema: {
        example: 'en',
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  // TODO: Remove this in production, config cho mấy ae fe test trước đã
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
  });

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
