import sendResponse from "../utils/responseHelper.js";

import { db } from "../config/db.js";
import { DB_TABLES } from "../utils/constants.js";

const getHomePageContents = async (req, res) => {
  const query = `SELECT * FROM ${DB_TABLES.HOMEPAGE}  WHERE id = 1`;

  const [rows] = await db.execute(query);

  if (rows.length === 0) {
    return sendResponse.failed(
      res,
      "No Homepage content found in the database",
      404
    );
  }

  sendResponse.success(res, "Homepage content retrieved successfully", rows[0]);
};

const editHomePageContents = async (req, res) => {
  const formData = req.body;
  const query = `UPDATE ${DB_TABLES.HOMEPAGE}  SET heroTitle = ?, heroContent = ?, aboutUsTitle = ?, aboutUsContent = ?, ourMissionTitle = ?, ourMissionContent = ?, ourVisionTitle = ?, ourVisionContent = ?, whyChabacanoTitle = ?, whyChabacanoContent = ? WHERE id = 1`;

  const updatedData = [
    formData.heroTitle,
    formData.heroContent,
    formData.aboutUsTitle,
    formData.aboutUsContent,
    formData.ourMissionTitle,
    formData.ourMissionContent,
    formData.ourVisionTitle,
    formData.ourVisionContent,
    formData.whyChabacanoTitle,
    formData.whyChabacanoContent,
  ];

  const [result] = await db.execute(query, updatedData);

  if (!result.affectedRows > 0) {
    return sendResponse.failed(res, "Home page content update failed", 400);
  }

  sendResponse.success(
    res,
    "Home page content updated successfully",
    null,
    200
  );
};

export { getHomePageContents, editHomePageContents };
