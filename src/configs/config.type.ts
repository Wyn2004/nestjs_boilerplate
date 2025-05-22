import { AppConfig } from 'src/types/app-config.type';
import { MongoConfig } from 'src/types/mongo-config.type';
import { PostgresConfig } from 'src/types/postgre-config.type';
import { RedisConfig } from 'src/types/redis-config.type';

export type AllConfigType = {
  app: AppConfig;
  postgres: PostgresConfig;
  mongo: MongoConfig;
  redis: RedisConfig;
};
