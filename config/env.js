import { config } from "dotenv";

config({ path: ".env", quiet: true });

const env = {
  ...process.env,
  APP_ENV:
    process.env.npm_lifecycle_event === "dev"
      ? "development"
      : process.env.APP_ENV ?? "development",
};

export const APP_ENV = env.APP_ENV;
export const DB_HOST = env.DB_HOST ?? env.PROD_DB_HOST;
export const DB_USERNAME = env.DB_USERNAME ?? env.PROD_DB_USER;
export const DB_PASSWORD = env.DB_PASSWORD ?? env.PROD_DB_PASS;
export const DB_DEV_DATABASE = env.DB_DEV_DATABASE;
export const DB_DATABASE = env.DB_DATABASE ?? env.DB_NAME;
export const DB_PORT = env.DB_PORT;
export const DB_SSL = env.DB_SSL;
export const SECRET_KEY = env.SECRET_KEY;
export const APP_PORT = env.APP_PORT;
