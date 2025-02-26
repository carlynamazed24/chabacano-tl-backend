import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Get equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the environment variablesss
const { DB_PASSWORD, DB_HOST, DB_USERNAME, DB_DATABASE } = process.env;

const dbConfig = {
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
};

if (process.env.APP_ENV === "production") {
  dbConfig.ssl = {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.resolve(__dirname, "isrgrootx1.pem"), "utf8"),
  };
}

const connectToDatabase = async () => {
  try {
    const db = await mysql.createConnection(dbConfig);
    console.log(
      `Connected to the ${process.env.APP_ENV} database successfully.`
    );
    return db;
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

export default connectToDatabase;
