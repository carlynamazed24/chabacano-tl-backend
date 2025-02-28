import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  getDictionaryEntries,
  addNewDictionaryEntry,
  updateDictionaryEntry,
  deleteDictionaryEntry,
  getDictionaryEntry,
} from "../handlers/dictionary.js";

const router = express.Router();

router.get("/", asyncHandler(getDictionaryEntries));
router.get("/:id", asyncHandler(getDictionaryEntry));
router.post("/add", asyncHandler(addNewDictionaryEntry));
router.put("/edit/:wordID", asyncHandler(updateDictionaryEntry));
router.delete("/delete/:wordID", asyncHandler(deleteDictionaryEntry));

export default router;
