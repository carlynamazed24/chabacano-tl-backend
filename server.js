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

import {
  corsOptions,
  handlePreflightRequest,
  handleCommonRequest,
} from "./utils/cors.js";

// Initialize Express app
const app = express();

app.use(cors(corsOptions));
app.set("trust proxy", 1);
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    },
    proxy: true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    handlePreflightRequest(req, res);
  }
  handleCommonRequest(req, res);
  next();
});

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/storypage", storyPageRoutes);
app.use("/api/dictionary", dictionaryPageRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = APP_PORT || 5000;

if (APP_ENV === "production") {
  await connectToDatabase();
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  // connectToDatabase();
});
