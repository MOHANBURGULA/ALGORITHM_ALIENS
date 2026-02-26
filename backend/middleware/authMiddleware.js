import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const header = req.headers.authorization;

  /* ⭐ NO TOKEN */
  if (!header) {
    return res.status(401).json({
      message: "No token provided",
      code: "NO_TOKEN"
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {

    /* ⭐ TOKEN EXPIRED */
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        code: "TOKEN_EXPIRED"
      });
    }

    /* ⭐ INVALID TOKEN */
    return res.status(401).json({
      message: "Invalid token",
      code: "INVALID_TOKEN"
    });
  }
};

export default auth;