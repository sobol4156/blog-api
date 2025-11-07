import dotenv from 'dotenv';

dotenv.config()



const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: [""],
  MONGO_URI: `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
}

export default config;