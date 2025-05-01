const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("Auth Header:", authorization);
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log("Decoded payload:", payload);
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization Required" });
  }
  req.user = payload;
  next();
};
