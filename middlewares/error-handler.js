const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).send({
    message: err.message || "An error occured on the server",
  });
};

module.exports = errorHandler;
