import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  APP_ENV,
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_DATABASE,
  DB_DEV_DATABASE,
} from "./env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export let db = null;

const dbConfig = {
  host: APP_ENV === "production" ? DB_HOST : "localhost",
  user: APP_ENV === "production" ? DB_USERNAME : "root",
  password: APP_ENV === "production" ? DB_PASSWORD : "",
  database: APP_ENV === "production" ? DB_DATABASE : DB_DEV_DATABASE,
};

if (APP_ENV === "production") {
  dbConfig.ssl = {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.resolve(__dirname, "isrgrootx1.pem"), "utf8"),
  };
}

const connectToDatabase = async () => {
  try {
    const database = await mysql.createConnection(dbConfig);
    console.log(`Connected to the ${APP_ENV} database successfully.`);
    db = database;
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

export default connectToDatabase;
