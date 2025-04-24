const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST_STATUS, NOT_FOUND } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => res.status(200).send(clothingItems))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => res.status(201).send(clothingItem))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
    .orFail()
    .then((clothingItem) => res.status(200).send(clothingItem))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItemById = (req, res) => {
  ClothingItem.findById(req.params.id)
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      return res
        .status(500)
        .json({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => res.status(200).send(clothingItem))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((clothingItem) => res.status(200).send(clothingItem))
    .catch((err) => {
      console.error(
        `Error ${err.name} with the message ${err.message} has occurred while executing the code`
      );
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS).send({ message: err.message });
      }
      return res
        .status(500)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  getItemById,
  likeItem,
  dislikeItem,
};
