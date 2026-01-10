import * as dotenv from 'dotenv';
import * as path from 'path';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';

dotenv.config({
  path: path.resolve(
    process.cwd(),
    isProd ? '.env.production' : '.env.development',
  ),
});

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: required('DATABASE_HOST'),
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: required('DATABASE_USERNAME'),
  password: required('DATABASE_PASSWORD'),
  database: required('DATABASE_NAME'),

  entities: isProd
    ? [path.resolve(__dirname, 'src/**/*.entity.js')]
    : [path.resolve(__dirname, 'src/modules/**/entities/*.entity.ts')],

  migrations: isProd
    ? [path.resolve(__dirname, 'src/migrations/*.js')]
    : [path.resolve(__dirname, 'src/migrations/*.ts')],

  synchronize: false,
});
