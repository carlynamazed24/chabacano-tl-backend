import connectToDatabase from "../config/db.js";
import sendResponse from "../utils/responseHelper.js";
import { DB_TABLES } from "../utils/constants.js";

const getSubHeaders = async (db) => {
  const subHeadersQuery = `SELECT * FROM ${DB_TABLES.SUBHEADERS}`;
  const [subHeaders] = await db.execute(subHeadersQuery);

  return subHeaders.map((subHeader) => ({
    id: subHeader.id,
    headingID: subHeader.headingID,
    subHeadingTitle: subHeader.subheadingTitle,
    subHeadingContent: subHeader.subheadingContent,
  }));
};

const addNewSubheadersStory = async (db, storyID, subheaders) => {
  try {
    subheaders.forEach(async (subheader) => {
      const query = `INSERT INTO ${DB_TABLES.SUBHEADERS} (headingID, subheadingTitle, subheadingContent) VALUES (?, ?, ?)`;
      const newData = [
        storyID,
        subheader.subHeadingTitle,
        subheader.subHeadingContent,
      ];

      const [result] = await db.execute(query, newData);

      if (result.affectedRows === 0) {
        throw new Error("Data insertion failed");
      }
    });
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Internal server error");
  }
};

const getStoryPageContents = async (req, res) => {
  const db = await connectToDatabase();

  const query = `SELECT * FROM ${DB_TABLES.STORY} ORDER BY sectionOrder DESC`;
  const [rows] = await db.execute(query);

  if (rows.length === 0) {
    return sendResponse.error(res, "No data found in the database", 400);
  }

  const storyHeaders = rows.map((row) => ({
    id: row.id,
    headingTitle: row.headingTitle,
    headingContent: row.headingContent,
    sectionOrder: row.sectionOrder,
  }));

  const storySubHeaders = await getSubHeaders(db);

  const storyData = storyHeaders.map((storyHeader) => {
    const subHeaders = storySubHeaders.filter(
      (subheader) => subheader.headingID === storyHeader.id
    );
    return { ...storyHeader, subHeaders };
  });

  sendResponse.success(res, "Story data retrieved successfully", storyData);
};

const getStorySectionContent = async (req, res) => {
  const { storyID } = req.params;

  const db = await connectToDatabase();

  const query = `SELECT * FROM ${DB_TABLES.STORY} WHERE id = ?`;
  const [story] = await db.execute(query, [storyID]);

  if (story.length === 0) {
    return sendResponse.error(res, "Story not found", 400);
  }

  const storyHeader = story[0];

  const subHeadersQuery = `SELECT * FROM ${DB_TABLES.SUBHEADERS} WHERE headingID = ?`;
  const [subHeaders] = await db.execute(subHeadersQuery, [storyID]);

  const storyData = {
    id: storyHeader.id,
    headingTitle: storyHeader.headingTitle,
    headingContent: storyHeader.headingContent,
    sectionOrder: storyHeader.sectionOrder,
    subHeaders: subHeaders.map((subHeader) => ({
      id: subHeader.id,
      headingID: subHeader.headingID,
      subHeadingTitle: subHeader.subheadingTitle,
      subHeadingContent: subHeader.subheadingContent,
    })),
  };

  sendResponse.success(res, "Story data retrieved successfully", storyData);
};

const addNewStoryHeader = async (req, res) => {
  const formData = req.body;

  const db = await connectToDatabase();

  const query = `INSERT INTO ${DB_TABLES.STORY} (headingTitle, headingContent, sectionOrder) VALUES (?, ?, ?)`;
  const getExistingOrderQuery = `SELECT MAX(sectionOrder) as maxOrder FROM ${DB_TABLES.STORY}`;

  const [existingOrder] = await db.execute(getExistingOrderQuery);
  const newOrder = existingOrder[0].maxOrder + 1;

  const newData = [formData.headingTitle, formData.headingContent, newOrder];
  const [result] = await db.execute(query, newData);

  if (result.affectedRows === 0) {
    return sendResponse.error(res, "New story insertion failed", 400);
  }

  if (formData.subHeaders.length > 0) {
    const getNewlyAddedStoryIDQuery = `SELECT MAX(id) as newStoryID FROM ${DB_TABLES.STORY}`;
    const [newStoryID] = await db.execute(getNewlyAddedStoryIDQuery);
    const newStoryIDValue = newStoryID[0].newStoryID;

    addNewSubheadersStory(db, newStoryIDValue, formData.subHeaders);
  }

  sendResponse.success(res, "New Story added successfully", null, 200);
};

const updateStoryHeader = async (req, res) => {
  const formData = req.body;
  const { storyID } = req.params;

  const db = await connectToDatabase();

  const query = `UPDATE ${DB_TABLES.STORY} SET headingTitle = ?, headingContent = ? WHERE id = ?`;
  const query2 = `DELETE FROM ${DB_TABLES.SUBHEADERS} WHERE headingID = ?`; // Delete all subheaders first

  const updatedData = [formData.headingTitle, formData.headingContent, storyID];

  const [result] = await db.execute(query, updatedData);

  if (result.affectedRows === 0) {
    return sendResponse.failed(res, "Story Header update failed", 400);
  }

  await db.execute(query2, [storyID]); // Delete all subheaders first before adding new ones

  if (formData.subHeaders.length > 0) {
    addNewSubheadersStory(db, storyID, formData.subHeaders);
  }

  sendResponse.success(res, "Story Header updated successfully", null, 200);
};

const deleteStoryHeader = async (req, res) => {
  const db = await connectToDatabase();

  const { storyID } = req.params;

  const query = `DELETE FROM ${DB_TABLES.STORY} WHERE id = ?`;
  const query2 = `DELETE FROM ${DB_TABLES.SUBHEADERS}  WHERE headingID = ?`;

  const [result] = await db.execute(query, [storyID]);

  if (result.affectedRows === 0) {
    return sendResponse.failed(res, "Story Header deletion failed", 400);
  }

  await db.execute(query2, [storyID]);

  sendResponse.success(res, "Story Header deleted successfully", null, 200);
};

const changeOrderSection = async (req, res) => {
  const { direction } = req.body;
  const { storyID } = req.params;

  const db = await connectToDatabase();

  // Get the current story
  const query = `SELECT * FROM ${DB_TABLES.STORY} WHERE id = ?`;
  const [story] = await db.execute(query, [storyID]);

  if (story.length === 0) {
    return sendResponse.failed(res, "Story not found", 400);
  }

  const currentStory = story[0];
  const newOrderSection =
    direction === "up"
      ? currentStory.sectionOrder - 1
      : currentStory.sectionOrder + 1;

  // Check if there's a section to swap with
  const querySwap = `SELECT * FROM ${DB_TABLES.STORY} WHERE sectionOrder = ?`;
  const [swapStory] = await db.execute(querySwap, [newOrderSection]);

  if (swapStory.length === 0) {
    return sendResponse.failed(res, "Cannot move section further", 400);
  }

  // Swap section orders
  const updateOtherStoryQuery = `UPDATE ${DB_TABLES.STORY} SET sectionOrder = ? WHERE id = ?`;
  const updateSelectedStoryQuery = `UPDATE ${DB_TABLES.STORY} SET sectionOrder = ? WHERE id = ?`;

  await db.execute(updateOtherStoryQuery, [
    currentStory.sectionOrder,
    swapStory[0].id,
  ]);
  await db.execute(updateSelectedStoryQuery, [newOrderSection, storyID]);

  sendResponse.success(res, "Story order changed successfully", null, 200);
};

export {
  getStoryPageContents,
  getStorySectionContent,
  addNewStoryHeader,
  updateStoryHeader,
  deleteStoryHeader,
  changeOrderSection,
};
