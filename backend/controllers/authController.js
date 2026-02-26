import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (!user.rows.length)
      return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.rows[0].password);

    if (!valid)
      return res.status(400).json({ message: "Invalid password" });

    const accessToken = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const refreshToken = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      role: user.rows[0].role
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login error" });
  }
};


/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (!user.rows.length)
      return res.status(404).json({ message: "User not found" });

    // 1️⃣ Generate raw token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2️⃣ Hash token before storing
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3️⃣ Store hashed token + expiry
    await pool.query(
      `UPDATE users
       SET reset_token=$1,
           reset_token_expiry=NOW()+INTERVAL '15 minutes'
       WHERE id=$2`,
      [hashedToken, user.rows[0].id]
    );

    // 4️⃣ Create reset URL (NO hardcoding)
    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 5️⃣ Send email
    await sendEmail(
      email,
      "Password Reset Request",
      `
        <h3>Password Reset</h3>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link expires in 15 minutes.</p>
      `
    );

    res.json({ message: "Reset link sent to email" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Forgot password error" });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // 1️⃣ Hash token before matching
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await pool.query(
      `SELECT * FROM users
       WHERE reset_token=$1
       AND reset_token_expiry > NOW()`,
      [hashedToken]
    );

    if (!user.rows.length)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users
       SET password=$1,
           reset_token=NULL,
           reset_token_expiry=NULL
       WHERE id=$2`,
      [hashed, user.rows[0].id]
    );

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Reset password error" });
  }
};


/* ================= REFRESH TOKEN ================= */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ accessToken });

  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};


/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};


/* ================= UPDATE PROFILE ================= */
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    await pool.query(
      "UPDATE users SET name=$1 WHERE id=$2",
      [name, req.user.id]
    );

    res.json({ message: "Profile updated" });

  } catch (err) {
    res.status(500).json({ message: "Profile update error" });
  }
};