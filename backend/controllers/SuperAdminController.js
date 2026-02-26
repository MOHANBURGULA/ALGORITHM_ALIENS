// export const createUserBySuperAdmin = async (req, res) => {
//   try {
//     if (req.user.role !== "SUPER_ADMIN") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     const { name, email, password, role } = req.body;

//     const hash = await bcrypt.hash(password, 10);

//     const user = await pool.query(
//       `INSERT INTO users (name,email,password,role)
//        VALUES ($1,$2,$3,$4)
//        RETURNING id,name,email,role`,
//       [name, email, hash, role]
//     );

//     res.status(201).json(user.rows[0]);

//   } catch (err) {
//     res.status(500).json({ message: "Creation error" });
//   }
// };