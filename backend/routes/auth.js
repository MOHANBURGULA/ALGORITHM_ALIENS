import express from "express";
import {
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile
} from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= LOGIN ================= */
router.post("/login", login);

/* ================= REFRESH ================= */
router.post("/refresh", refreshToken);

/* ================= LOGOUT ================= */
router.post("/logout", auth, logout);

/* ================= FORGOT PASSWORD ================= */
/* ⭐ MUST MATCH FRONTEND */
router.post("/forgot-password", forgotPassword);

/* ================= RESET PASSWORD ================= */
router.post("/reset-password", resetPassword);

/* ================= PROFILE UPDATE ================= */
router.put("/profile", auth, updateProfile);

export default router;