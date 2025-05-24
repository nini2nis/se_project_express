const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const {
  validateSignupBody,
  validateSigninBody,
} = require("../middlewares/validation");

router.post("/signin", validateSigninBody, login);
router.post("/signup", validateSignupBody, createUser);

module.exports = router;
