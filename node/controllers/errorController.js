/* eslint-disable no-param-reassign */
const AppError = require('../utils/appError');

const handleJWTError = () => new AppError('Invalid token please login again', 401);

const handleExpiredError = () => new AppError('Your token has been expired, please log in again.');

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.userName;
  const [keyPattern] = Object.keys(err.keyPattern);
  const message = `${keyPattern} Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

module.exports = (err, req, res) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Server Error..';
  if (err.message === 'data and salt arguments required') err = new AppError('Password is requireed', 400);
  if (err.name === 'CastError') err = handleCastErrorDB(err);
  if (err.code === 11000) {
    err = handleDuplicateFieldsDB(err);
  }
  if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') err = handleJWTError();
  if (err.name === 'TokenExpiredError') err = handleExpiredError();

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something wrong! Please try again',
    });
  }
};
