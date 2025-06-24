import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export default registerAs('orm.config', (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === 'false',
    logging: process.env.DB_LOGGING === 'false', // true = enable logging
    autoLoadEntities: true, // Auto loads entities from the app
    entities: [
      path.resolve(__dirname, '..', '**/*.entity{.ts,.js}'),
      path.resolve(__dirname, '..', '**/entities/*.entity{.ts,.js}'),
    ],
    migrations: [
      path.resolve(__dirname, '..', 'core/config/migrations/*{.ts,.js}'),
    ],
    migrationsRun: true,
  };
});