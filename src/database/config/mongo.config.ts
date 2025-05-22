// @database/config/mongo.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('mongo', () => ({
  uri:
    process.env.MONGO_URI ||
    `mongodb://${process.env.DATABASE_HOST}:${process.env.MONGO_DATABASE_PORT}/${process.env.MONGO_DATABASE_NAME}`,
}));
