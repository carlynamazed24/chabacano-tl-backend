import express from "express";
import connectToDatabase from "../config/db.js";

const router = express.Router();

// Handle POST request for admission data
router.put("/homepage", async (req, res) => {
  const formData = req.body;

  try {
    const db = await connectToDatabase();

    const query =
      "UPDATE homepage_content_tb SET heroTitle = ?, heroContent = ?, aboutUsTitle = ?, aboutUsContent = ?, ourMissionTitle = ?, ourMissionContent = ?, ourVisionTitle = ?, ourVisionContent = ?, whyChabacanoTitle = ?, whyChabacanoContent = ? WHERE id = 1";

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
      res.status(400).json({ status: "failed", message: "Data update failed" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Data updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
