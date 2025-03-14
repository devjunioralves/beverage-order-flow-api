import dotenv from 'dotenv'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASS || 'secret',
  database: process.env.DB_NAME || 'resale_db',
  synchronize: true,
  logging: true,
  entities: ['src/domain/**/models/*.ts'],
  migrations: ['src/infra/database/migrations/*.ts'],
  subscribers: [],
})
