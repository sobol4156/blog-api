import dotenv from 'dotenv';
import type ms from 'ms';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: [''],
  MONGO_URI: `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMINS_MAIL: ['admin@email.com', 'admin2@email.com', 'admin3@email.com'],
  defaultResLimit: 20,
  defaultResOffset: 0,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
};

export default config;
