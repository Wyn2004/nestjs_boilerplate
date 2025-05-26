import { AppConfig } from '../types/app-config.type';
import { PostgresConfig } from '../types/postgre-config.type';
import { MongoConfig } from '../types/mongo-config.type';
import { RedisConfig } from '../types/redis-config.type';
import { GoogleConfig } from '../types/google-config.type';
import { AuthConfig } from '../types/auth-config.type';
import { MailConfig } from '../types/mail-config.type';

export type AllConfigType = {
  app: AppConfig;
  postgres: PostgresConfig;
  mongo: MongoConfig;
  redis: RedisConfig;
  google: GoogleConfig;
  auth: AuthConfig;
  mail: MailConfig;
};
