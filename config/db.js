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
  DB_PORT,
  DB_SSL,
} from "./env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = APP_ENV === "production";
const dbHost = DB_HOST || "localhost";
const isLocalDatabaseHost = ["localhost", "127.0.0.1", "::1"].includes(dbHost);
const shouldUseSsl =
  DB_SSL === "true" || (DB_SSL !== "false" && (isProduction || !isLocalDatabaseHost));

const dbConfig = {
  host: dbHost,
  port: Number(DB_PORT || 3306),
  user: DB_USERNAME || "root",
  password: DB_PASSWORD || "",
  database: isProduction ? DB_DATABASE : DB_DEV_DATABASE || DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (shouldUseSsl) {
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
    const connection = await pool.getConnection();
    connection.release();
    console.log(`Connected to the ${APP_ENV} database successfully.`);
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

export default connectToDatabase;
