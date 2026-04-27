import express from "express";
import cors from "cors";
import session from "express-session";

import { APP_ENV, SECRET_KEY, APP_PORT } from "./config/env.js";

import connectToDatabase from "./config/db.js";

import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import homepageRoutes from "./routes/homepage.routes.js";
import storyPageRoutes from "./routes/storyPage.routes.js";
import dictionaryPageRoutes from "./routes/dictionary.routes.js";
import translationRoutes from "./routes/translation.routes.js";

import {
  corsOptions,
  handlePreflightRequest,
  handleCommonRequest,
} from "./utils/cors.js";

const isProduction = APP_ENV === "production";
const SESSION_SECRET =
  SECRET_KEY || (isProduction ? undefined : "dev-session-secret");

if (!SESSION_SECRET) {
  throw new Error("SECRET_KEY is required when APP_ENV is production");
}

// Initialize Express app
const app = express();

app.use(cors(corsOptions));
app.set("trust proxy", isProduction ? 1 : false);
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    },
    proxy: isProduction,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return handlePreflightRequest(req, res);
  }
  handleCommonRequest(req, res);
  next();
});

if (isProduction) {
  await connectToDatabase();
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/storypage", storyPageRoutes);
app.use("/api/dictionary", dictionaryPageRoutes);
app.use("/api/translation", translationRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = APP_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  // connectToDatabase();
});
