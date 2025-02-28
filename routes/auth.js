import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { login, logout, checkAuth } from "../handlers/auth.js";

const router = express.Router();

// Handle POST request for admin login
router.post("/login", asyncHandler(login));
router.get("/logout", asyncHandler(logout));
router.get("/check", asyncHandler(checkAuth));

export default router;
