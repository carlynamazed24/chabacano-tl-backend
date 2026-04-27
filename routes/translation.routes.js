import express from "express";

import { translateText } from "../controllers/translation.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/", asyncHandler(translateText));

export default router;
