import express from "express";
import auth from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import {
  assignTeamLead,
  getAllProjectProgress,
  getCEOAnalyticsDashboard,
  getTeamLeadsAnalytics,
  getInternsForAssignment,
  getProjectFullDetails,
  createEmployee
} from "../controllers/ceoController.js";

const router = express.Router();
router.use(auth);
router.use(authorizeRoles("CEO","SUPER_ADMIN"));

router.put("/assign-teamlead", assignTeamLead);
router.get("/project-progress", getAllProjectProgress);
router.get("/analytics-dashboard", getCEOAnalyticsDashboard);
router.get("/project-details/:id", getProjectFullDetails);
router.get("/team-leads", getTeamLeadsAnalytics);
router.get("/interns", getInternsForAssignment);
router.post("/create-employee", createEmployee);

export default router;