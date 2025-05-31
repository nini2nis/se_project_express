const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data provided"));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { email, name, avatar } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        avatar,
      })
    )
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;
      res.status(201).send(userResponse);
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "ValidationError") {
        next(new BadRequestError("Please enter a valid input"));
      }
      if (err.code === 11000) {
        next(new ConflictError("Input already in use"));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const update = {};
  if (name) update.name = name;
  if (avatar) update.avatar = avatar;
  User.findByIdAndUpdate(req.user._id, update, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "ValidationError") {
        next(new BadRequestError("Please enter a valid input"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("A valid email and password is required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

module.exports = { getCurrentUser, createUser, updateProfile, login };
