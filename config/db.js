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

const dbConfig = {
  host: APP_ENV === "production" ? DB_HOST : "localhost",
  user: APP_ENV === "production" ? DB_USERNAME : "root",
  password: APP_ENV === "production" ? DB_PASSWORD : "",
  database: APP_ENV === "production" ? DB_DATABASE : DB_DEV_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (APP_ENV === "production") {
  dbConfig.ssl = {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.resolve(__dirname, "isrgrootx1.pem"), "utf8"),
  };
}

const pool = mysql.createPool(dbConfig);

export const db = {
  execute: (...args) => pool.execute(...args),
};

const connectToDatabase = async () => {
  try {
    await pool.getConnection(); // Just test connection
    console.log(`Connected to the ${APP_ENV} database successfully.`);
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

export default connectToDatabase;
