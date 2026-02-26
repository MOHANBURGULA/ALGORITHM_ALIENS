import { pool } from "../config/db.js";
import { createNotification } from "../utils/notificationService.js";

/* ================= CREATE PROJECT ================= */
export const createNewProject = async (req, res) => {
  try {
    const { title, description, deadline, internId } = req.body;

    const project = await pool.query(
      `INSERT INTO projects
       (title, description, deadline, intern_id, team_lead_id, status)
       VALUES ($1,$2,$3,$4,$5,'Ongoing')
       RETURNING *`,
      [title, description, deadline, internId, req.user.id]
    );

    await createNotification(
      internId,
      `New project assigned: ${title}`,
      "PROJECT_ASSIGNED"
    );

    res.status(201).json(project.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create project error" });
  }
};

/* ================= MY INTERNS ================= */
export const getMyInterns = async (req, res) => {
  const interns = await pool.query(
    `SELECT id,name,email
     FROM users
     WHERE role='INTERN' AND team_lead_id=$1`,
    [req.user.id]
  );
  res.json(interns.rows);
};

/* ================= MY PROJECTS ================= */
export const getMyProjects = async (req, res) => {
  const projects = await pool.query(
    "SELECT * FROM projects WHERE team_lead_id=$1",
    [req.user.id]
  );
  res.json(projects.rows);
};

/* ================= PROJECT SUBMISSIONS ================= */
export const completeProject = async (req, res) => {
  try {

    const { projectId } = req.params;

    /* ⭐ fetch project */
    const project = await pool.query(
      `SELECT * FROM projects WHERE id=$1 AND team_lead_id=$2`,
      [projectId, req.user.id]
    );

    if (!project.rows.length)
      return res.status(404).json({ message: "Project not found" });

    const p = project.rows[0];

    /* ⭐ update project */
    await pool.query(
      `UPDATE projects SET status='Completed' WHERE id=$1`,
      [projectId]
    );

    /* ⭐ notify intern */
    await createNotification(
      p.intern_id,
      `Project completed: ${p.title}`,
      "PROJECT_COMPLETED"
    );

    /* ⭐ notify CEO */
    const ceo = await pool.query(
      `SELECT id FROM users WHERE role='CEO' LIMIT 1`
    );

    if (ceo.rows.length) {
      await createNotification(
        ceo.rows[0].id,
        `Project completed by TeamLead: ${p.title}`,
        "PROJECT_COMPLETED"
      );
    }
    /* ⭐ NEW → notify HR (safe addition) */
const hr = await pool.query(
  `SELECT id FROM users WHERE role='HR' LIMIT 1`
);

if (hr.rows.length) {
  await createNotification(
    `hr.rows[0].id,
    Project completed by intern: ${p.title},
    "PROJECT_COMPLETED"`
  );
}

    res.json({ message: "Project completed successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Completion error" });
  }
};

/* ================= REVIEW SUBMISSION ================= */
export const reviewSubmission = async (req, res) => {
  const { submissionId, status, feedback } = req.body;

  const updated = await pool.query(
    `UPDATE submissions
     SET status=$1,feedback=$2
     WHERE id=$3 RETURNING *`,
    [status, feedback, submissionId]
  );

  const submission = updated.rows[0];

  await createNotification(
    submission.intern_id,
    `Your submission ${status}`,
    "FEEDBACK"
  );

  res.json(submission);
};
export const getProjectSubmissions = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT 
        s.*,
        p.title AS project_title,
        u.name AS intern_name
       FROM submissions s
       JOIN projects p ON s.project_id = p.id
       JOIN users u ON s.intern_id = u.id
       WHERE p.team_lead_id = $1
       ORDER BY s.submitted_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching submissions" });
  }
};
/* =========================
   GIVE FEEDBACK
========================= */
export const giveFeedback = async (req, res) => {
  try {

    const { submissionId } = req.params;
    const { feedback } = req.body;

    if (!feedback || feedback.trim() === "")
      return res.status(400).json({ message: "Feedback required" });

    /* ⭐ VERIFY SUBMISSION BELONGS TO TL */
    const sub = await pool.query(
      `SELECT s.*, p.team_lead_id
       FROM submissions s
       JOIN projects p ON s.project_id = p.id
       WHERE s.id=$1`,
      [submissionId]
    );

    if (!sub.rows.length)
      return res.status(404).json({ message: "Submission not found" });

    if (sub.rows[0].team_lead_id !== req.user.id)
      return res.status(403).json({ message: "Not your intern submission" });

    /* ⭐ UPDATE FEEDBACK */
    await pool.query(
      `UPDATE submissions SET feedback=$1 WHERE id=$2`,
      [feedback, submissionId]
    );

    /* ⭐ NOTIFY INTERN */
    await createNotification(
      sub.rows[0].intern_id,
      `Feedback added on submission`,
      "FEEDBACK"
    );

    res.json({ message: "Feedback saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Feedback error" });
  }
};

/* ================= EDIT PROJECT ================= */
export const editProject = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, deadline } = req.body;

  const result = await pool.query(
    `UPDATE projects
     SET title=$1,description=$2,deadline=$3
     WHERE id=$4 AND team_lead_id=$5 RETURNING *`,
    [title, description, deadline, projectId, req.user.id]
  );

  res.json(result.rows[0]);
};

/* ================= DELETE PROJECT ================= */
export const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  await pool.query(
    "DELETE FROM projects WHERE id=$1 AND team_lead_id=$2",
    [projectId, req.user.id]
  );

  res.json({ message: "Deleted" });
};

/* ================= ⭐ FINAL DASHBOARD FULL ================= */
export const getTeamLeadDashboardFull = async (req, res) => {
  try {
    const internsQuery = pool.query(
      "SELECT COUNT(*) FROM users WHERE role='INTERN' AND team_lead_id=$1",
      [req.user.id]
    );

    const activeProjectsQuery = pool.query(
      "SELECT COUNT(*) FROM projects WHERE team_lead_id=$1 AND status!='Completed'",
      [req.user.id]
    );

    const completedQuery = pool.query(
      `SELECT COUNT(*) FROM submissions s
       JOIN projects p ON s.project_id=p.id
       WHERE p.team_lead_id=$1 AND s.status='Approved'`,
      [req.user.id]
    );

    const pendingQuery = pool.query(
      `SELECT COUNT(*) FROM submissions s
       JOIN projects p ON s.project_id=p.id
       WHERE p.team_lead_id=$1 AND s.status='Pending'`,
      [req.user.id]
    );

    const graphQuery = pool.query(
      `SELECT 
        u.name AS intern,
        COUNT(s.id) AS totalsubmissions,
        COUNT(s.id) FILTER (WHERE DATE(s.submitted_at)>p.deadline) AS latesubmissions
       FROM users u
       LEFT JOIN projects p ON p.intern_id=u.id
       LEFT JOIN submissions s ON s.project_id=p.id
       WHERE u.role='INTERN' AND u.team_lead_id=$1
       GROUP BY u.name`,
      [req.user.id]
    );

    const recentQuery = pool.query(
      `SELECT u.name AS intern,p.title AS project,s.status,s.submitted_at
       FROM submissions s
       JOIN projects p ON s.project_id=p.id
       JOIN users u ON p.intern_id=u.id
       WHERE p.team_lead_id=$1
       ORDER BY s.submitted_at DESC LIMIT 3`,
      [req.user.id]
    );

    const projectsQuery = pool.query(
      `SELECT p.id,p.title,
        COUNT(s.id) FILTER (WHERE s.status='Approved') AS approved,
        COUNT(s.id) AS total
       FROM projects p
       LEFT JOIN submissions s ON s.project_id=p.id
       WHERE p.team_lead_id=$1 AND p.status!='Completed'
       GROUP BY p.id,p.title`,
      [req.user.id]
    );

    /* ⭐ NEW → overall progress */
    const overallProgressQuery = pool.query(
      `SELECT 
        ROUND(
          AVG(
            CASE 
              WHEN total=0 THEN 0
              ELSE approved*100.0/total
            END
          )
        ) AS progress
       FROM (
         SELECT 
           p.id,
           COUNT(s.id) FILTER (WHERE s.status='Approved') AS approved,
           COUNT(s.id) AS total
         FROM projects p
         LEFT JOIN submissions s ON s.project_id=p.id
         WHERE p.team_lead_id=$1 AND p.status!='Completed'
         GROUP BY p.id
       ) t`,
      [req.user.id]
    );

    const [
      interns,
      active,
      completed,
      pending,
      graph,
      recent,
      projects,
      overall
    ] = await Promise.all([
      internsQuery,
      activeProjectsQuery,
      completedQuery,
      pendingQuery,
      graphQuery,
      recentQuery,
      projectsQuery,
      overallProgressQuery
    ]);

    res.json({
      cards: {
        interns: parseInt(interns.rows[0].count),
        activeProjects: parseInt(active.rows[0].count),
        completedTasks: parseInt(completed.rows[0].count),
        pendingReviews: parseInt(pending.rows[0].count)
      },
      performanceGraphData: graph.rows,
      recentSubmissions: recent.rows,
      activeProjectsList: projects.rows,
      overallProgress: overall.rows[0].progress || 0
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};