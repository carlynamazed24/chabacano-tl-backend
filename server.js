import express from "express";
import https from "https";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import homepageRoutes from "./routes/homepage.js";
import storyPageRoutes from "./routes/storyPage.js";
import dictionaryPageRoutes from "./routes/dictionary.js";

import {
  corsOptions,
  httpsLocalHostingOptions,
  handlePreflightRequest,
  handleCommonRequest,
} from "./utils/cors.js";

dotenv.config();

// Initialize Express app
const app = express();

app.use(cors(corsOptions));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
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
app.use((err, req, res, next) => {
  console.error("Unhandled Error", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// Start the server
const PORT = process.env.APP_PORT || 5000;

/* process.env.APP_ENV === "development" &&
  https.createServer(httpsLocalHostingOptions, app).listen(PORT, () => {
    console.log("Server running at https://localhost:5000");
  }); */

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
