import express from "express";

import {
  getHomePageContents,
  editHomePageContents,
} from "../controllers/homepage.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getHomePageContents));
router.put("/edit", asyncHandler(editHomePageContents));

export default router;
