import { AppConfig } from 'src/types/app-config.type';
import { PostgresConfig } from 'src/types/postgre-config.type';
export type AllConfigType = {
  app: AppConfig;
  postgres: PostgresConfig;
};
