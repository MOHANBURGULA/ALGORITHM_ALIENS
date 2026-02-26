
import bcrypt from "bcryptjs";
import { pool } from "../config/db.js";


/* =========================
   CREATE INTERN
========================= */
export const createIntern = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (existing.rows.length) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name,email,password,role)
       VALUES ($1,$2,$3,'INTERN')
       RETURNING id,name,email,role`,
      [name, email, hash]
    );

    res.status(201).json({
      message: "Intern created successfully",
      intern: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create intern error" });
  }
};
/* =========================
CREATE EMPLOYEE (INTERN + TEAM LEAD)
========================= */
export const createEmployee = async (req, res) => {
try {

const { name, email, password, role } = req.body;

if (!name || !email || !password || !role) {
  return res.status(400).json({ message: "All fields required" });
}

/* ⭐ HR cannot create HR or CEO */
if (role === "HR" || role === "CEO") {
  return res.status(403).json({ message: "Invalid role" });
}

/* ⭐ CHECK EMAIL EXISTS */
const existing = await pool.query(
  "SELECT id FROM users WHERE email=$1",
  [email]
);

if (existing.rows.length) {
  return res.status(400).json({ message: "Email already exists" });
}

const hash = await bcrypt.hash(password, 10);

const result = await pool.query(
  `INSERT INTO users (name,email,password,role)
   VALUES ($1,$2,$3,$4)
   RETURNING id,name,email,role`,
  [name, email, hash, role]
);

res.status(201).json({
  message: "Employee created successfully",
  employee: result.rows[0]
});

} catch (err) {
console.error(err);
res.status(500).json({ message: "Create employee error" });
}
};


/* =========================
   ASSIGN / REASSIGN INTERN
========================= */
export const assignIntern = async (req, res) => {
  try {

    const { internId, teamLeadId } = req.body;

    if (!internId || !teamLeadId) {
      return res.status(400).json({ message: "internId and teamLeadId required" });
    }

    const intern = await pool.query(
      "SELECT id FROM users WHERE id=$1 AND role='INTERN'",
      [internId]
    );

    if (!intern.rows.length) {
      return res.status(404).json({ message: "Intern not found" });
    }

    const teamLead = await pool.query(
      "SELECT id FROM users WHERE id=$1 AND role='TEAM_LEAD'",
      [teamLeadId]
    );

    if (!teamLead.rows.length) {
      return res.status(404).json({ message: "Team Lead not found" });
    }

    await pool.query(
      "UPDATE users SET team_lead_id=$1 WHERE id=$2",
      [teamLeadId, internId]
    );

    res.json({
      message: "Intern assigned successfully",
      internId,
      teamLeadId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Assign error" });
  }
};

/* =========================
   HR ANALYTICS + DASHBOARD
========================= */
export const getHRAnalyticsDashboard = async (req, res) => {
  try {
    
    /* -------- TOTAL INTERNS -------- */
    const totalInternsQuery = pool.query(
      "SELECT COUNT(*) FROM users WHERE role='INTERN'"
    );

    /* -------- INTERN COUNT PER TEAM LEAD -------- */
    const internsPerTeamLeadQuery = pool.query(`
      SELECT 
        t.id,
        t.name AS teamLead,
        COUNT(i.id) AS internCount
      FROM users t
      LEFT JOIN users i
        ON i.team_lead_id = t.id AND i.role='INTERN'
      WHERE t.role='TEAM_LEAD'
      GROUP BY t.id
      ORDER BY t.name
    `);

    /* -------- PROJECT STATS -------- */
    const projectStatsQuery = pool.query(`
  SELECT 
    COUNT(*) FILTER (WHERE status IN ('Ongoing','In Progress','Pending','Late')) AS active,
    COUNT(*) FILTER (WHERE status='Completed') AS completed
  FROM projects
`);

const delayedProjectsQuery = pool.query(`
  SELECT COUNT(*)
  FROM projects
  WHERE deadline < CURRENT_DATE
  AND status IN ('Ongoing','In Progress','Pending','Late')
`);

    /* -------- LATE SUBMISSIONS -------- */
    const lateSubmissionsQuery = pool.query(`
      SELECT COUNT(*)
      FROM submissions s
      JOIN projects p ON s.project_id = p.id
      WHERE s.submitted_at > p.deadline
    `);

    /* -------- SUBMISSION TRACKING -------- */
    const submissionTrackingQuery = pool.query(`
      SELECT 
        i.id,
        i.name AS intern,
        COUNT(s.id) AS totalSubmissions,
        COUNT(s.id) FILTER (WHERE s.status='Approved') AS approved,
        COUNT(s.id) FILTER (WHERE s.status='Rejected') AS rejected,
        COUNT(s.id) FILTER (WHERE s.status='Pending') AS pending
      FROM users i
      LEFT JOIN submissions s
        ON s.intern_id = i.id
      WHERE i.role='INTERN'
      GROUP BY i.id
      ORDER BY i.name
    `);

    /* -------- LATE SUBMISSION TRACKING -------- */
    const lateSubmissionTrackingQuery = pool.query(`
      SELECT 
        i.id,
        i.name AS intern,
        COUNT(s.id) AS totalSubmissions,
        COUNT(s.id) FILTER (WHERE s.submitted_at > p.deadline) AS lateSubmissions
      FROM users i
      LEFT JOIN submissions s ON s.intern_id = i.id
      LEFT JOIN projects p ON s.project_id = p.id
      WHERE i.role='INTERN'
      GROUP BY i.id
      ORDER BY i.name
    `);

    /* ⭐ WEEKLY SUBMISSIONS (MONTH RESET + EMPTY WEEK PADDING) */
    const weeklySubmissionQuery = pool.query(`
      WITH weeks AS (
        SELECT 1 AS week UNION
        SELECT 2 UNION
        SELECT 3 UNION
        SELECT 4
      ),
      weekly_data AS (
        SELECT
          FLOOR((EXTRACT(DAY FROM submitted_at) - 1) / 7) + 1 AS week,
          COUNT(*) AS total
        FROM submissions
        WHERE DATE_TRUNC('month', submitted_at) = DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY week
      )
      SELECT
        CONCAT('Week ', w.week) AS week,
        COALESCE(d.total, 0) AS total
      FROM weeks w
      LEFT JOIN weekly_data d ON w.week = d.week
      ORDER BY w.week;
    `);

    /* -------- EXECUTE PARALLEL -------- */
    const [
      totalInterns,
      internsPerTeamLead,
      projectStats,
      delayedProjects,
      lateSubmissions,
      submissionTracking,
      lateSubmissionTracking,
      weeklySubmissions
    ] = await Promise.all([
      totalInternsQuery,
      internsPerTeamLeadQuery,
      projectStatsQuery,
      delayedProjectsQuery,
      lateSubmissionsQuery,
      submissionTrackingQuery,
      lateSubmissionTrackingQuery,
      weeklySubmissionQuery
    ]);

    /* -------- FINAL RESPONSE -------- */
    res.json({
      totals: {
        interns: parseInt(totalInterns.rows[0].count),
        activeProjects: parseInt(projectStats.rows[0].active),
        completedProjects: parseInt(projectStats.rows[0].completed),
        delayedProjects: parseInt(delayedProjects.rows[0].count),
        lateSubmissions: parseInt(lateSubmissions.rows[0].count)
      },
      internsPerTeamLead: internsPerTeamLead.rows,
      submissionTracking: submissionTracking.rows,
      lateSubmissionTracking: lateSubmissionTracking.rows,
      weeklySubmissions: weeklySubmissions.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "HR Analytics Dashboard error" });
  }
};
/* =========================
   GET HR INTERNS LIST
========================= */
export const getHRInterns = async (req, res) => {
  try {
    
    const result = await pool.query(`
      SELECT
        i.id,
        i.name,
        i.email,
        i.created_at,
        i.team_lead_id,
        tl.name AS team_lead_name
      FROM users i
      LEFT JOIN users tl ON i.team_lead_id = tl.id
      WHERE i.role='INTERN'
      ORDER BY i.created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Intern fetch error" });
  }
};
/* =========================
   GET INTERN DETAILS
========================= */
export const getInternDetails = async (req,res)=>{
  try{
    const id=req.params.id;

    const intern=await pool.query(`
      SELECT 
        i.id,
        i.name,
        i.email,
        i.created_at,
        i.team_lead_id,
        tl.name AS team_lead_name
      FROM users i
      LEFT JOIN users tl ON i.team_lead_id=tl.id
      WHERE i.id=$1
    `,[id]);

    const stats=await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE p.status='Ongoing') AS ongoing_projects,
        COUNT(*) FILTER (WHERE p.status='Completed') AS completed_projects,
        COUNT(s.id) AS total_submissions,
        COUNT(s.id) FILTER (WHERE s.status='Approved') AS approved,
        COUNT(s.id) FILTER (WHERE s.status='Pending') AS pending
      FROM users u
      LEFT JOIN projects p ON p.intern_id=u.id
      LEFT JOIN submissions s ON s.intern_id=u.id
      WHERE u.id=$1
      GROUP BY u.id
    `,[id]);

    res.json({
      ...intern.rows[0],
      stats:stats.rows[0]
    });

  }catch(err){
    console.error(err);
    res.status(500).json({message:"Intern details error"});
  }
};

/* =========================
   REMOVE INTERN
========================= */
export const removeIntern = async (req,res)=>{
  try{
    const id=req.params.id;
    await pool.query("DELETE FROM users WHERE id=$1",[id]);
    res.json({message:"Intern removed"});
  }catch(err){
    res.status(500).json({message:"Remove error"});
  }
};
/* =========================
   GET TEAM LEADS LIST
========================= */
export const getTeamLeads = async (req,res)=>{
  try{
    const result=await pool.query(`
      SELECT id,name FROM users
      WHERE role='TEAM_LEAD'
      ORDER BY name
    `);
    res.json(result.rows);
  }catch(err){
    res.status(500).json({message:"Teamlead fetch error"});
  }
};
/* =========================
   HR SUBMISSIONS LIST
========================= */
export const getHRSubmissions = async (req, res) => {
  try {
  

    const result = await pool.query(`
      SELECT
        s.id,
        s.pdf_url,
        s.status,
        s.submitted_at,
        p.title AS project,
        i.name AS intern_name,
        tl.name AS team_lead_name
      FROM submissions s
      JOIN users i ON s.intern_id = i.id
      LEFT JOIN users tl ON i.team_lead_id = tl.id
      JOIN projects p ON s.project_id = p.id
      ORDER BY s.submitted_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "HR submissions error" });
  }
};