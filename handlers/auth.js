import bcrypt from "bcrypt";
import connectToDatabase from "../config/db.js";
import sendResponse from "../utils/responseHelper.js";
import { DB_TABLES } from "../utils/constants.js";

const login = async (req, res) => {
  const { username, password } = req.body;

  const db = await connectToDatabase();

  const query = `SELECT * FROM ${DB_TABLES.ADMINS}  WHERE username = ?`;
  const [rows] = await db.execute(query, [username]);

  if (rows.length === 0) {
    return sendResponse.failed(res, "Invalid username or password", 400);
  }

  const admin = rows[0];

  bcrypt.compare(password, admin.password, (err, result) => {
    if (err) {
      console.error("Error:", err);
      return sendResponse(res, "An error occurred", 500);
    }

    if (!result) {
      return sendResponse.failed(res, "Invalid username or password", 400);
    }

    res.cookie("connect.sid", req.sessionID, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    req.session.admin = { username: admin.username };

    sendResponse.success(
      res,
      "Login successful",
      { admin: req.session.admin },
      200
    );
  });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return sendResponse.failed(res, "Logout failed", 500);
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    return sendResponse.success(res, "Logged out successfully", {}, 200);
  });
};

const checkAuth = (req, res) => {
  if (req.session.admin) {
    return sendResponse.success(
      res,
      "Authenticated",
      { admin: req.session.admin },
      200
    );
  }
  return sendResponse.failed(res, "Not authenticated", 401);
};

export { login, logout, checkAuth };
