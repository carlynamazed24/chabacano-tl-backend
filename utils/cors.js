import dotenv from "dotenv";
import fs from "fs";
import { ALLOWED_ORIGINS } from "./constants.js";

dotenv.config();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || isInAllowedOrigins(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const httpsLocalHostingOptions = {
  key:
    process.env.APP_ENV === "production"
      ? ""
      : fs.readFileSync("./certs/localhost-key.pem"),
  cert:
    process.env.APP_ENV === "production"
      ? ""
      : fs.readFileSync("./certs/localhost.pem"),
};

const handlePreflightRequest = (req, res) => {
  const origin = req.headers.origin;

  if (!isInAllowedOrigins(origin)) {
    return res.status(403).json({ error: "Origin not allowed by CORS" });
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
  res.setHeader("Vary", "Origin");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  return res.status(200).end();
};

const handleCommonRequest = (req, res) => {
  const origin = req.headers.origin;

  if (isInAllowedOrigins(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");
    res.setHeader("Vary", "Origin");
  }
};

const isInAllowedOrigins = (origin) => {
  return ALLOWED_ORIGINS.includes(origin);
};

export {
  corsOptions,
  httpsLocalHostingOptions,
  handlePreflightRequest,
  handleCommonRequest,
};
