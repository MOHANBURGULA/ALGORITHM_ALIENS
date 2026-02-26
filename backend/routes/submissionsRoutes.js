
import express from "express";
import { pool } from "../config/db.js";
import auth from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
const router = express.Router();
router.use(auth);
/* =========================
   GET ALL SUBMISSIONS (CEO ONLY)
========================= */
router.get("/all",authorizeRoles("CEO"), async (req, res) => {
  try { 

    const result = await pool.query(
      "SELECT * FROM submissions ORDER BY submitted_at DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching submissions" });
  }
});

/* =========================
   GET SUBMISSIONS BY PROJECT
========================= */
router.get("/project/:id", authorizeRoles("CEO", "TEAM_LEAD"), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM submissions WHERE project_id = $1",
      [id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching submissions" });
  }
});

/* =========================
   GET SUBMISSIONS BY INTERN
========================= */
router.get("/intern/:id", authorizeRoles("CEO", "TEAM_LEAD", "INTERN"), async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM submissions WHERE intern_id = $1",
      [id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching submissions" });
  }
});

export default router;
