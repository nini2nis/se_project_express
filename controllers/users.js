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
        throw new NotFoundError("User not found");
      }
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid data provided");
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
        throw new BadRequestError("Please enter a valid input");
      }
      if (err.code === 11000) {
        throw new ConflictError("Input already in use");
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
        throw new BadRequestError("Please enter a valid input");
      }
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("User not found");
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("A valid email and password is required");
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
        throw new UnauthorizedError("Incorrect email or password");
      } else {
        next(err);
      }
    });
};

// const {
//   BAD_REQUEST_STATUS,
//   NOT_FOUND,
//   SERVER_ERROR,
//   CONFLICT_ERROR,
//   UNAUTHORIZED,
// } = require("../utils/errors");

// const getCurrentUser = (req, res) => {
//   const userId = req.user._id;
//   User.findById(userId)
//     .orFail()
//     .then((user) => {
//       res.send({ user });
//     })
//     .catch((err) => {
//       console.error(
//         `Error ${err.name} with the message ${err.message} has occurred while executing the code`
//       );
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({ message: err.message });
//       }
//       if (err.name === "CastError") {
//         return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const createUser = (req, res) => {
//   const { email, name, avatar } = req.body;
//   bcrypt
//     .hash(req.body.password, 10)
//     .then((hash) =>
//       User.create({
//         email,
//         password: hash,
//         name,
//         avatar,
//       })
//     )
//     .then((user) => {
//       const userResponse = user.toObject();
//       delete userResponse.password;
//       res.status(201).send(userResponse);
//     })
//     .catch((err) => {
//       console.error(
//         `Error ${err.name} with the message ${err.message} has occurred while executing the code`
//       );
//       if (err.name === "ValidationError") {
//         return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
//       }
//       if (err.code === 11000) {
//         return res
//           .status(CONFLICT_ERROR)
//           .send({ message: "Invalid: email already in use" });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const updateProfile = (req, res) => {
//   const { name, avatar } = req.body;
//   const update = {};
//   if (name) update.name = name;
//   if (avatar) update.avatar = avatar;
//   User.findByIdAndUpdate(
//     req.user._id,
//     { name, avatar },
//     { new: true, runValidators: true }
//   )
//     .orFail()
//     .then((user) => res.send(user))
//     .catch((err) => {
//       console.error(
//         `Error ${err.name} with the message ${err.message} has occurred while executing the code`
//       );
//       if (err.name === "ValidationError") {
//         return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
//       }
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({ message: err.message });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const login = (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res
//       .status(BAD_REQUEST_STATUS)
//       .send({ message: "A valid email and password is required" });
//   }
//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
//         expiresIn: "7d",
//       });
//       res.send({ token });
//     })
//     .catch((err) => {
//       console.error(
//         `Error ${err.name} with the message ${err.message} has occurred while executing the code`
//       );
//       if (err.message === "Incorrect email or password") {
//         return res.status(UNAUTHORIZED).send({ message: err.message });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

module.exports = { getCurrentUser, createUser, updateProfile, login };
