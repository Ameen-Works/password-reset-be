const JWT = require("jsonwebtoken");

const dotenv = require("dotenv");
// dotenv.config({ path: "./JWTConfig.env" });

const secretKey = process.env.SECRET_KEY;
const expiresIn = process.env.EXPIRES_IN;

const generateToken = (loginUser) => {
  return JWT.sign(loginUser, secretKey, { expiresIn: expiresIn });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = JWT.verify(token, secretKey);
    req.loginUser = decoded;
    next();
  } catch (error) {
    console.error("Invalid Token", error);
    res.status(501).json({ error: "Invalid Token" });
  }
};

module.exports = { generateToken, verifyToken };
