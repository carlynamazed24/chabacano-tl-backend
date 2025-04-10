import { config } from "dotenv";

config({ path: `.env` });

export const {
  APP_ENV,
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DEV_DATABASE,
  DB_DATABASE,
  SECRET_KEY,
  APP_PORT,
} = process.env;
