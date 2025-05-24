const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateItemId,
  validateCardBody,
} = require("../middlewares/validation");

const {
  getItems,
  createItem,
  deleteItem,
  getItemById,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/items", getItems);
router.get("/items/:id", auth, validateItemId, getItemById);
router.post("/items", auth, validateCardBody, createItem);
router.delete("/items/:id", auth, validateItemId, deleteItem);
router.put("/items/:id/likes", auth, validateItemId, likeItem);
router.delete("/items/:id/likes", auth, validateItemId, dislikeItem);

module.exports = router;
