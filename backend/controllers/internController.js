import { pool } from "../config/db.js";
import { createNotification } from "../utils/notificationService.js";

/* =========================
   GET ASSIGNED PROJECT
========================= */
export const getMyProject = async (req, res) => {
  try {
    const project = await pool.query(
      "SELECT * FROM projects WHERE intern_id=$1",
      [req.user.id]
    );

    res.json(project.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching project" });
  }
};

/* =========================
   SUBMIT WORK
========================= */
export const submitWork = async (req, res) => {
  try {

    const { projectId, title, description } = req.body;

    if (!req.files || !req.files.pdf)
      return res.status(400).json({ message: "File required" });

    const pdfPath = req.files.pdf[0].filename;

    const additionalDocs = req.files.additionalDocs
      ? req.files.additionalDocs.map((f) => f.filename)
      : [];

    const project = await pool.query(
      "SELECT deadline FROM projects WHERE id=$1",
      [projectId]
    );

    if (!project.rows.length)
      return res.status(404).json({ message: "Project not found" });

    const deadline = project.rows[0].deadline;
    const isLate = new Date() > new Date(deadline);

    const serialResult = await pool.query(
      `SELECT COALESCE(MAX(serial_no),0)+1 AS next_serial
       FROM submissions WHERE project_id=$1`,
      [projectId]
    );

    const serialNo = serialResult.rows[0].next_serial;

    const newSubmission = await pool.query(
      `INSERT INTO submissions
       (project_id, intern_id, title, description, pdf_url,
        additional_docs, serial_no, status, is_late)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'Pending',$8)
       RETURNING *`,
      [
        projectId,
        req.user.id,
        title,
        description,
        pdfPath,
        JSON.stringify(additionalDocs),
        serialNo,
        isLate
      ]
    );

    const internTL = await pool.query(
      "SELECT team_lead_id,name FROM users WHERE id=$1",
      [req.user.id]
    );

    const teamLeadId = internTL.rows[0].team_lead_id;
    const internName = internTL.rows[0].name;

    await createNotification(
      teamLeadId,
      `New submission uploaded by ${internName}`,
      "SUBMISSION_UPLOADED"
    );

    res.status(201).json({
      message: "Submitted Successfully",
      submission: newSubmission.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Submission error" });
  }
};

/* =========================
   VIEW MY SUBMISSIONS
========================= */
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await pool.query(
      "SELECT * FROM submissions WHERE intern_id=$1 ORDER BY serial_no ASC",
      [req.user.id]
    );

    res.json(submissions.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};

/* =========================
   PROGRESS TRACKER
========================= */
export const getProgress = async (req, res) => {
  try {
    const total = await pool.query(
      "SELECT COUNT(*) FROM submissions WHERE intern_id=$1",
      [req.user.id]
    );

    const approved = await pool.query(
      "SELECT COUNT(*) FROM submissions WHERE intern_id=$1 AND status='Approved'",
      [req.user.id]
    );

    /* ⭐ NEW → ONGOING PROJECTS */
   const ongoingProjects = await pool.query(
  `SELECT COUNT(*)
   FROM projects
   WHERE intern_id=$1
   AND status='Ongoing'`,
  [req.user.id]
);

    const submissionConsistency = await pool.query(
      `SELECT TO_CHAR(submitted_at,'IYYY-IW') AS week,
              COUNT(*) AS submissions
       FROM submissions
       WHERE intern_id=$1
       GROUP BY week
       ORDER BY week`,
      [req.user.id]
    );

    const timeline = await pool.query(
      `SELECT id,title,status,submitted_at
       FROM submissions
       WHERE intern_id=$1
       ORDER BY submitted_at ASC`,
      [req.user.id]
    );

    const totalCount = parseInt(total.rows[0].count);
    const approvedCount = parseInt(approved.rows[0].count);
    const ongoingCount = parseInt(ongoingProjects.rows[0].count);

    res.json({
      summary: {
        activeProjects: ongoingCount,   // ⭐ important
        totalSubmissions: totalCount,
        approvedSubmissions: approvedCount,
        completionPercentage:
          totalCount === 0 ? 0 : Math.round((approvedCount / totalCount) * 100)
      },
      submissionConsistency: submissionConsistency.rows,
      timelineTracker: timeline.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error calculating progress" });
  }
};