const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authentication");
  if (!token) return res.status(401).json({ message: "access denied" });
  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = user;
    next();
  } catch (err) {
    // err
    res.status(401).json({ message: "login required" });
  }
};
