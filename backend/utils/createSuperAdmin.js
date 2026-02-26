
import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

const createSuperAdmin = async () => {
  try {
    const existing = await pool.query(
      "SELECT id FROM users WHERE role='SUPER_ADMIN' LIMIT 1"
    );

    if (existing.rows.length > 0) {
      console.log("✅ Super Admin already exists");
      return;
    }

    if (!process.env.SUPER_ADMIN_EMAIL || !process.env.SUPER_ADMIN_PASSWORD) {
      console.log("❌ Super Admin env variables missing");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      10
    );

    await pool.query(
      `INSERT INTO users (name,email,password,role)
       VALUES ($1,$2,$3,$4)`,
      [
        "Super Admin",
        process.env.SUPER_ADMIN_EMAIL,
        hashedPassword,
        "SUPER_ADMIN"
      ]
    );

    console.log("🔥 Super Admin created successfully");

  } catch (error) {
    console.error("Super Admin Seeder Error:", error);
  }
};

export default createSuperAdmin;