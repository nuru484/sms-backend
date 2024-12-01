// src/utils/middleware/errorHandler.js

class CustomError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const handleError = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res.status(error.status).json({ message: error.message });
  }
  return res
    .status(500)
    .json({ message: `Internal Server Error ${error.message}` });
};

export { CustomError, handleError };
