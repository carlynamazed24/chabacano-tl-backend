import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getHomePageContents,
  editHomePageContents,
} from "../handlers/homepage.js";

const router = express.Router();

router.get("/", asyncHandler(getHomePageContents));
router.put("/edit", asyncHandler(editHomePageContents));

export default router;
