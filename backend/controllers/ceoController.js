import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

/* =========================
   ASSIGN TEAM LEAD TO INTERN
========================= */
export const assignTeamLead = async (req, res) => {
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
      message: "Team Lead assigned successfully",
      internId,
      teamLeadId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Assignment error" });
  }
};


/* =========================
   VIEW ALL PROJECT PROGRESS
========================= */
export const getAllProjectProgress = async (req, res) => {
  try {
    const progress = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.status,
        u.name AS intern,
        t.name AS teamLead,
        p.deadline
      FROM projects p
      JOIN users u ON p.intern_id = u.id
      JOIN users t ON p.team_lead_id = t.id
      ORDER BY p.created_at DESC
    `);

    res.json(progress.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Progress fetch error" });
  }
};


/* =========================
   CEO ANALYTICS DASHBOARD (RESTORED)
========================= */
export const getCEOAnalyticsDashboard = async (req, res) => {
  try {
    const totalInternsQuery = pool.query(
      "SELECT COUNT(*) FROM users WHERE role='INTERN'"
    );

    const totalProjectsQuery = pool.query(
      "SELECT COUNT(*) FROM projects"
    );

    const projectStatsQuery = pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status='Ongoing') AS active,
        COUNT(*) FILTER (WHERE status='Completed') AS completed
      FROM projects
    `);

    const totalSubmissionsQuery = pool.query(
      "SELECT COUNT(*) FROM submissions"
    );

    const approvedSubmissionsQuery = pool.query(
      "SELECT COUNT(*) FROM submissions WHERE status='Approved'"
    );

    /* ⭐ FIXED on-time logic (NO is_late column dependency) */
    const onTimeSubmissionsQuery = pool.query(`
      SELECT COUNT(*)
      FROM submissions s
      JOIN projects p ON s.project_id=p.id
      WHERE s.submitted_at <= p.deadline
    `);

    const dailyTrendQuery = pool.query(`
      SELECT DATE(submitted_at) AS day, COUNT(*) AS total
      FROM submissions
      GROUP BY day
      ORDER BY day DESC
      LIMIT 7
    `);

    /* ⭐ INDUSTRY TEAM PERFORMANCE QUERY */
    const teamPerformanceQuery = pool.query(`
  SELECT 
    tl.id,
    tl.name AS teamLead,
    COUNT(DISTINCT i.id) AS interns,
    COUNT(DISTINCT p.id) AS projects,

    COUNT(s.id) FILTER (WHERE s.status='Approved') AS approvedSubmissions,
    COUNT(s.id) AS totalSubmissions

  FROM users tl

  LEFT JOIN users i 
    ON i.team_lead_id = tl.id 
    AND i.role='INTERN'

  LEFT JOIN projects p 
    ON p.team_lead_id = tl.id

  LEFT JOIN submissions s 
    ON s.project_id = p.id 
    AND s.intern_id = i.id   -- ⭐ CRITICAL FIX

  WHERE tl.role='TEAM_LEAD'

  GROUP BY tl.id
  ORDER BY tl.name
`);

    const [
      totalInterns,
      totalProjects,
      projectStats,
      totalSubmissions,
      approvedSubmissions,
      onTimeSubmissions,
      dailyTrend,
      teamPerformance
    ] = await Promise.all([
      totalInternsQuery,
      totalProjectsQuery,
      projectStatsQuery,
      totalSubmissionsQuery,
      approvedSubmissionsQuery,
      onTimeSubmissionsQuery,
      dailyTrendQuery,
      teamPerformanceQuery
    ]);

    const interns = parseInt(totalInterns.rows[0].count);
    const projects = parseInt(totalProjects.rows[0].count);
    const activeProjects = parseInt(projectStats.rows[0].active);
    const completedProjects = parseInt(projectStats.rows[0].completed);

    const submissions = parseInt(totalSubmissions.rows[0].count);
    const approved = parseInt(approvedSubmissions.rows[0].count);
    const onTime = parseInt(onTimeSubmissions.rows[0].count);

    const completionRate =
      projects === 0 ? 0 : Math.round((completedProjects / projects) * 100);

    const approvalRate =
      submissions === 0 ? 0 : Math.round((approved / submissions) * 100);

    const onTimeRate =
      submissions === 0 ? 0 : Math.round((onTime / submissions) * 100);

    const productivityScore =
      Math.round((approvalRate * 0.5) + (onTimeRate * 0.5));

    res.json({
      totals: {
        interns,
        projects,
        activeProjects,
        completedProjects,
        submissions,
        approvedSubmissions: approved
      },

      submissionTrends: {
        daily: dailyTrend.rows
      },

      progressTracking: {
        completionPercentage: completionRate,
        approvalRate,
        onTimeRate,
        productivityScore
      },

      teamPerformance: teamPerformance.rows,

      growth: {
        internGrowth: 0,
        projectGrowth: 0,
        completionGrowth: 0
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "CEO Dashboard error" });
  }
};


/* =========================
   ⭐ TEAM LEADS ANALYTICS
========================= */
export const getTeamLeadsAnalytics = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        tl.id,
        tl.name,
        tl.email,
        COUNT(DISTINCT i.id) AS interns,
        COUNT(DISTINCT p.id) AS projects,
        CASE
          WHEN COUNT(DISTINCT s.id)=0 THEN 0
          ELSE ROUND(
            (COUNT(DISTINCT s.id) FILTER (WHERE s.status='Approved')::decimal
            / COUNT(DISTINCT s.id)) * 100
          )
        END AS completionRate
      FROM users tl
      LEFT JOIN users i ON i.team_lead_id = tl.id AND i.role='INTERN'
      LEFT JOIN projects p ON p.team_lead_id = tl.id
      LEFT JOIN submissions s ON s.project_id = p.id
      WHERE tl.role='TEAM_LEAD'
      GROUP BY tl.id
      ORDER BY tl.name
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Team leads analytics error" });
  }
};


/* =========================
   ⭐ INTERN LIST FOR ASSIGN
========================= */
export const getInternsForAssignment = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id,name,email,team_lead_id
      FROM users
      WHERE role='INTERN'
      ORDER BY name
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Intern fetch error" });
  }
};
/* =========================
   ⭐ PROJECT FULL DETAILS
========================= */
export const getProjectFullDetails = async (req, res) => {
  try {

    const { id } = req.params;

    const project = await pool.query(`
      SELECT 
        p.*,
        u.name AS intern,
        t.name AS teamlead
      FROM projects p
      JOIN users u ON p.intern_id=u.id
      JOIN users t ON p.team_lead_id=t.id
      WHERE p.id=$1
    `,[id]);

    if (!project.rows.length) {
      return res.status(404).json({ message: "Project not found" });
    }

    const submissions = await pool.query(`
      SELECT * FROM submissions
      WHERE project_id=$1
      ORDER BY submitted_at DESC
    `,[id]);

    res.json({
      project: project.rows[0],
      submissions: submissions.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Project details error" });
  }
};

export const createEmployee = async (req,res)=>{
  try{
    const {name,email,password,role,team_lead_id} = req.body;
    if (role === "SUPER_ADMIN") {
  return res.status(403).json({
    message: "Cannot create SUPER_ADMIN via API"
  });
}
    const hash = await bcrypt.hash(password,10);

    await pool.query(
      `INSERT INTO users (name,email,password,role,team_lead_id)
       VALUES ($1,$2,$3,$4,$5)`,
      [name,email,hash,role, role==="INTERN"?team_lead_id:null]
    );

    res.json({message:"Employee created"});

  }catch(err){
    console.error(err);
    res.status(500).json({message:"Create error"});
  }
};