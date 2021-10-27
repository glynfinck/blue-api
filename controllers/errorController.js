const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const keyValue = Object.entries(err.keyValue)[0];
  const message = `Duplicate Field Value '${keyValue[0]}': '${keyValue[1]}'.`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors);
  const message = `Invalid input data. ${errors.join('. ')}.`;
  return new AppError(message, 400);
};

const handleLoginAttemptFirebase = () => {
  return new AppError('Wrong email or password. Please try again', 400);
};

const handleEmailExistsErrorFirebase = () => {
  return new AppError('Email already exists', 400);
};

const sendErrorDev = (err, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational Error, trusted error: send message to client.
  if (err.isOperational) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details.
  } else {
    // 1) Log Error to Console.
    console.error('ERROR: ', err);

    // 2) Send generic message.
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong.',
    });
  }
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error._message === 'Validation failed')
      error = handleValidatorErrorDB(error);
    if (error.code === 'auth/email-already-in-use')
      error = handleEmailExistsErrorFirebase();
    if (
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    )
      error = handleLoginAttemptFirebase();
    sendErrorProd(error, res);
  }
};
