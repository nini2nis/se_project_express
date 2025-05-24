class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};

// const BAD_REQUEST_STATUS = 400;
// const UNAUTHORIZED = 401;
// const NOT_FOUND = 404;
// const FORBIDDEN = 403;
// const CONFLICT_ERROR = 409;
// const SERVER_ERROR = 500;

// module.exports = {
//   BAD_REQUEST_STATUS,
//   NOT_FOUND,
//   SERVER_ERROR,
//   CONFLICT_ERROR,
//   UNAUTHORIZED,
//   FORBIDDEN,
// };
