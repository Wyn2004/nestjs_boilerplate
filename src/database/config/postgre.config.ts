import { registerAs } from '@nestjs/config';
import { PostgresConfig } from 'src/types/postgre-config.type';

export default registerAs<PostgresConfig>('postgres', () => ({
  host: process.env.POSTGRE_DATABASE_HOST || 'localhost',
  port: parseInt(process.env.POSTGRE_DATABASE_PORT || '5432', 10),
  username: process.env.POSTGRE_DATABASE_USERNAME || 'postgres',
  password: process.env.POSTGRE_DATABASE_PASSWORD || 'postgres',
  database: process.env.POSTGRE_DATABASE_NAME || 'postgres',
  synchronize: true,
}));
