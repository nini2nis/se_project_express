const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middlewares/auth");
const { NOT_FOUND } = require("./utils/errors");

const { PORT = 3001 } = process.env;

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use("/", require("./routes/index"));
app.use("/", require("./routes/users"));
app.use("/", auth, require("./routes/clothingItems"));

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Page not found" });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
