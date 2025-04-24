const express = require("express");
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use((req, res, next) => {
  req.user = {
    _id: "68091ec940de0d6a1bd97e5d",
  };
  next();
});

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
