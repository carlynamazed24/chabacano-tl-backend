import express from "express";
import cors from "cors";
import homepageRoutes from "./routes/homepage.js";
import {
  corsOptions,
  handlePreflightRequest,
  handleCommonRequest,
} from "./utils/cors.js";

// Initialize Express app
const app = express();

// Middleware to handle CORS and preflight requests
app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    handlePreflightRequest(req, res);
  }
  next();
});

app.use((req, res, next) => {
  handleCommonRequest(req, res);
  next();
});

// Register routes
app.use("/api/edit", homepageRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
