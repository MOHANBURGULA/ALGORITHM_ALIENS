import { pool } from "../config/db.js";

/* =========================
   CREATE SUBMISSION
========================= */
export const createSubmission = async (req, res) => {
  try {
    const { projectId, title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "PDF required" });
    }

    /* ⭐ CRITICAL FIX */
    const pdf = req.file.filename;

    const result = await pool.query(
      `
      INSERT INTO submissions
      (intern_id, project_id, title, description, pdf_url)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [req.user.id, projectId, title, description, pdf]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Submission error" });
  }
};