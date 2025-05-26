import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from '@configs/app.config';
import postgreConfig from '@database/config/postgre.config';
import { UsersModule } from '@modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '@database/config/type-orm.config';
import mongoConfig from '@database/config/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbackModule } from '@modules/feedback/feedback.module';
import redisConfig from '@database/config/redis.config';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import * as redisStore from 'cache-manager-ioredis';
import { CacheModule } from '@nestjs/cache-manager';
import googleConfig from '@modules/auth/configs/google-oauth.config';
import { AuthModule } from '@modules/auth/auth.module';
import jwtConfig from '@modules/auth/configs/jwt.config';
import refreshJwtConfig from '@modules/auth/configs/refresh-jwt.config';
import authConfig from '@modules/auth/configs/auth.config';
import mailConfig from '@modules/mail/configs/mail.config';
import { MaillerModule } from '@modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        postgreConfig,
        mongoConfig,
        redisConfig,
        jwtConfig,
        refreshJwtConfig,
        authConfig,
        googleConfig,
        mailConfig,
      ],
      cache: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('mongo.uri'),
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): RedisModuleOptions => ({
        type: 'single',
        options: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        return {
          store: redisStore,
          host: redisConfig.host,
          port: redisConfig.port,
          ttl: 300,
        };
      },
    }),
    AuthModule,
    UsersModule,
    FeedbackModule,
    MaillerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
