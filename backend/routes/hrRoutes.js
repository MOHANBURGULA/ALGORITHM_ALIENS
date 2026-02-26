import express from "express";
import auth from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import {
createIntern,
assignIntern,
getHRAnalyticsDashboard,
getHRInterns,
getInternDetails,
removeIntern,
getTeamLeads,
getHRSubmissions,
createEmployee
} from "../controllers/hrController.js";

const router = express.Router();
router.use(auth);
router.use(authorizeRoles("HR","SUPER_ADMIN"));
router.post("/create-intern", createIntern);
router.post("/create-employee", createEmployee);
router.put("/assign-intern", assignIntern);
router.get("/analytics-dashboard", getHRAnalyticsDashboard);
router.get("/interns", getHRInterns);
router.get("/intern-details/:id", getInternDetails);
router.delete("/remove-intern/:id", removeIntern);
router.get("/teamleads", getTeamLeads);
router.get("/submissions", getHRSubmissions);

export default router;