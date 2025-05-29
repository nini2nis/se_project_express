const ClothingItem = require("../models/clothingItem");

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  console.log("GET /items endpoint hit");
  ClothingItem.find({})
    .then((clothingItems) => res.send(clothingItems))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "DocumentNotFound") {
        throw new NotFoundError("Items not found");
      } else {
        next(err);
      }
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => res.status(201).send(clothingItem))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "ValidationError") {
        throw new BadRequestError("Please enter a valid input");
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  ClothingItem.findById(req.params.id)
    .orFail()
    .then((clothingItem) => {
      if (clothingItem.owner.equals(req.user._id)) {
        return ClothingItem.findByIdAndDelete(req.params.id);
      }
      throw new ForbiddenError("Unauthorized");
    })
    .then((clothingItem) => {
      res.send(clothingItem);
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("Item not found");
      }
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid request");
      } else {
        next(err);
      }
    });
};

const getItemById = (req, res, next) => {
  ClothingItem.findById(req.params.id)
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => res.send(clothingItem))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("Item not found");
      }
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid request");
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => res.send(clothingItem))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "DocumentNotFoundError") {
        throw new NotFoundError("Item not found");
      }
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid request");
      } else {
        next(err);
      }
    });
};

// const {
//   BAD_REQUEST_STATUS,
//   NOT_FOUND,
//   SERVER_ERROR,
//   FORBIDDEN,
// } = require("../utils/errors");

// const getItems = (req, res) => {
//   ClothingItem.find({})
//     .then((clothingItems) => res.send(clothingItems))
//     .catch((err) => {
//       console.error(
//         `Error ${err.name} with the message ${err.message} has occurred while executing the code`
//       );
//       if (err.name === "DocumentNotFound") {
//         return res.status(NOT_FOUND).send({ message: err.message });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const createItem = (req, res) => {
//   const { name, weather, imageUrl } = req.body;
//   ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
//     .then((clothingItem) => res.status(201).send(clothingItem))
//     .catch((err) => {
//       console.error(
//         `Error ${err.name} with the message ${err.message} has occurred while executing the code`
//       );
//       if (err.name === "ValidationError") {
//         return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
//       }
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// const deleteItem = (req, res) => {
//   ClothingItem.findById(req.params.id)
//     .orFail()
//     .then((clothingItem) => {
//       if (clothingItem.owner.equals(req.user._id)) {
//         return ClothingItem.findByIdAndDelete(req.params.id);
//       }
//       return res.status(FORBIDDEN).send({ message: "Not authorized" });
//     })
//     .then((clothingItem) => {
//       res.send(clothingItem);
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

// const getItemById = (req, res) => {
//   ClothingItem.findById(req.params.id)
//     .orFail()
//     .then((item) => {
//       res.send(item);
//     })
//     .catch((err) => {
//       console.error(
//         `Error ${err.name} with the message ${err.message} has occurred while executing the code`
//       );
//       return res
//         .status(SERVER_ERROR)
//         .json({ message: "An error has occurred on the server" });
//     });
// };

// const likeItem = (req, res) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.id,
//     { $addToSet: { likes: req.user._id } },
//     { new: true }
//   )
//     .orFail()
//     .then((clothingItem) => res.send(clothingItem))
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

// const dislikeItem = (req, res) => {
//   ClothingItem.findByIdAndUpdate(
//     req.params.id,
//     { $pull: { likes: req.user._id } },
//     { new: true }
//   )
//     .orFail()
//     .then((clothingItem) => res.send(clothingItem))
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

module.exports = {
  getItems,
  createItem,
  deleteItem,
  getItemById,
  likeItem,
  dislikeItem,
};
