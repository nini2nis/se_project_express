const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getItems,
  createItem,
  deleteItem,
  getItemById,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/items", getItems);
router.get("/items/:id", auth, getItemById);
router.post("/items/", auth, createItem);
router.delete("/items/:id", auth, deleteItem);
router.put("/items/:id/likes", auth, likeItem);
router.delete("/items/:id/likes", auth, dislikeItem);

module.exports = router;
