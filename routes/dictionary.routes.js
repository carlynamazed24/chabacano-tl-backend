import express from "express";

import {
  getDictionaryEntries,
  addNewDictionaryEntry,
  updateDictionaryEntry,
  deleteDictionaryEntry,
  getDictionaryEntry,
} from "../controllers/dictionary.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getDictionaryEntries));
router.get("/:id", asyncHandler(getDictionaryEntry));
router.post("/add", asyncHandler(addNewDictionaryEntry));
router.put("/edit/:wordID", asyncHandler(updateDictionaryEntry));
router.delete("/delete/:wordID", asyncHandler(deleteDictionaryEntry));

export default router;
