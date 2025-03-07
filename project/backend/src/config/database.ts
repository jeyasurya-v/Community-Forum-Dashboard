import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Forum } from '../entities/Forum';
import { Comment } from '../entities/Comment';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'community_forums',
  synchronize: true, // Set to false in production
  logging: false, // Disable logging
  entities: [User, Forum, Comment],
  subscribers: [],
  migrations: [],
}); 