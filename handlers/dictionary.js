import connectToDatabase from "../config/db.js";
import sendResponse from "../utils/responseHelper.js";
import { DB_TABLES } from "../utils/constants.js";

const getDictionaryEntries = async (req, res) => {
  const db = await connectToDatabase();

  const query = `SELECT * FROM ${DB_TABLES.DICTIONARY}`;

  const [rows] = await db.execute(query);

  if (rows.length === 0) {
    return sendResponse.failed(res, "No Entries found in the dictionary", 404);
  }

  sendResponse.success(res, "Dictionary Entries retrieved successfully", rows);
};

const getDictionaryEntry = async (req, res) => {
  const db = await connectToDatabase();
  const { id } = req.params;

  const query = `SELECT * FROM ${DB_TABLES.DICTIONARY} WHERE id = ?`;

  const [rows] = await db.execute(query, [id]);

  if (rows.length === 0) {
    return sendResponse.failed(res, "No Entry found in the dictionary", 404);
  }

  sendResponse.success(res, "Dictionary Entry retrieved successfully", rows[0]);
};

const addNewDictionaryEntry = async (req, res) => {
  const formData = req.body;

  const db = await connectToDatabase();

  const query = `INSERT INTO ${DB_TABLES.DICTIONARY} (chabacanoLang, tagalogLang, englishLang, definition) VALUES (?, ?, ?, ?)`;

  const newData = [
    formData.chabacanoLang,
    formData.tagalogLang,
    formData.englishLang,
    formData.definition,
  ];

  const [result] = await db.execute(query, newData);

  if (!result.affectedRows > 0) {
    return sendResponse.failed(res, "Insertion of new entry failed", 400);
  }

  sendResponse.success(res, "New entry added successfully", null, 201);
};

const updateDictionaryEntry = async (req, res) => {
  const formData = req.body;
  const { wordID } = req.params;

  const db = await connectToDatabase();

  const query = `UPDATE ${DB_TABLES.DICTIONARY} SET chabacanoLang = ?, tagalogLang = ?, englishLang = ?, definition = ? WHERE id = ?`;

  const updatedData = [
    formData.chabacanoLang,
    formData.tagalogLang,
    formData.englishLang,
    formData.definition,
    wordID,
  ];

  const [result] = await db.execute(query, updatedData);

  if (!result.affectedRows > 0) {
    return sendResponse.failed(res, "Updating of entry failed", 400);
  }

  sendResponse.success(res, "Entry Updated successfully", null, 201);
};

const deleteDictionaryEntry = async (req, res) => {
  const db = await connectToDatabase();

  const { wordID } = req.params;

  const query = `DELETE FROM ${DB_TABLES.DICTIONARY} WHERE id = ?`;

  const [result] = await db.execute(query, [wordID]);

  if (!result.affectedRows > 0) {
    return sendResponse.failed(res, "Entry deletion failed", 400);
  }

  sendResponse.success(res, "Entry deleted successfully", null, 200);
};

export {
  getDictionaryEntries,
  getDictionaryEntry,
  addNewDictionaryEntry,
  updateDictionaryEntry,
  deleteDictionaryEntry,
};
