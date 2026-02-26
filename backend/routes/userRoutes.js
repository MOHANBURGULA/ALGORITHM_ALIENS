import express from "express";
import auth from "../middleware/authMiddleware.js";
import { pool } from "../config/db.js";

const router = express.Router();

/* ⭐ GET CURRENT USER PROFILE */
router.get("/me", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id,name,email,role,created_at FROM users WHERE id=$1",
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile fetch error" });
  }
});

export default router;