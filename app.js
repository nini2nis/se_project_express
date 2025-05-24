const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");
const { NotFoundError } = require("./utils/errors");

const { PORT = 3001 } = process.env;

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(requestLogger);

app.use("/", require("./routes/index"));
app.use("/", require("./routes/users"));
app.use("/", require("./routes/clothingItems"));

app.use((req, res) => {
  throw new NotFoundError("Not found");
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
