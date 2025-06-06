require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");
const { NotFoundError } = require("./utils/error-NotFound");

const { PORT = 3001 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const app = express();

app.use(helmet());
app.use(limiter);

app.use(
  cors({
    origin: [
      "https://www.wtwr.webmakers.ch",
      "https://wtwr.webmakers.ch",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
/* remove above app.get after review */

app.use("/", require("./routes/index"));
app.use("/", require("./routes/users"));
app.use("/", require("./routes/clothingItems"));

app.use((_req, _res, next) => {
  next(new NotFoundError("Not found"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
