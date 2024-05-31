const jwt = require("jsonwebtoken");

const checkAuth = async (req, res, next) => {
  // "bearer token"
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      success: false,
      error: "Authorization header missing or incorrect format",
    });
  }
  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, error: "Invalid or expired token" });
  }
};

module.exports = {
  checkAuth,
};
