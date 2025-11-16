import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config(); // ✅ добавь это!

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT! || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    path.resolve(__dirname, 'src/modules/**/entities/*.entity.{ts,js}'),
  ],
  migrations: [path.resolve(__dirname, 'src/migrations/*{.ts,.js}')],
  synchronize: false,
});

// Command to create migrations:
// npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d data-source.ts migration:generate src/migrations/Init
