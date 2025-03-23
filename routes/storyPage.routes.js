import express from "express";

import {
  getStoryPageContents,
  getStorySectionContent,
  addNewStoryHeader,
  updateStoryHeader,
  deleteStoryHeader,
  changeOrderSection,
} from "../controllers/storyPage.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getStoryPageContents));
router.get("/:storyID", asyncHandler(getStorySectionContent));
router.post("/add", asyncHandler(addNewStoryHeader));
router.put("/edit/:storyID", asyncHandler(updateStoryHeader));
router.put("/change/order/:storyID", asyncHandler(changeOrderSection));
router.delete("/delete/:storyID", asyncHandler(deleteStoryHeader));

export default router;
