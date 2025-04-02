const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const logger = require('../logger');
const client = require('../redisClient');

dotenv.config('.env');
const { SECRET_KEY } = process.env;

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing Email or Password' });
  }

  const user = await User.findOne({ email }).select('+password');
  const correct = await user.correctPassword(password, user.password);

  const logInfo = {
    userName: user.fullName,
    status: '',
    timestamp: new Date().toISOString(),
  };
  const key = `user:${user._id}:Logs`;

  if (!user || !correct) {
    logger.error(`User ${user.fullName} failed to Log in !`);
    logInfo.status = 'failed';

    client.lPush(key, JSON.stringify(logInfo));
    client.lTrim(key, 0, 9);

    return res.status(401).json({ message: 'Invalid credentials' });
  }

  logger.info(`User ${user.fullName} Logged in !`);

  const token = jwt.sign({ id: user._id, email, fullName: user.fullName }, SECRET_KEY, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: user._id, email, fullName: user.fullName }, SECRET_KEY, { expiresIn: '7d' });

  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Strict' });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'Strict' });

  logInfo.status = 'success';
  client.lPush(key, JSON.stringify(logInfo));
  client.lTrim(key, 0, 9);

  return res.status(200).json({
    message: `Welcome ${user.fullName.split(' ')[0]}`,
    fullName: user.fullName,
    subs: user.subscriptions,
  });
});

const register = catchAsync(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Missing Email or Password' });
  }

  try {
    await User.create({
      fullName,
      email,
      password,
    });
    return res.status(201).json({ message: 'success' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
  }
  return res.status(400).json({ message: 'Email already exists' });
});

const logout = catchAsync(async (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Loggedout successfully !' });
});

const refreshToken = (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(403).json({ message: 'No refresh token provided' });
  }

  jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newToken = jwt.sign({ id: user._id , email: user.email }, SECRET_KEY, { expiresIn: '15m' });
    res.cookie('token', newToken, { httpOnly: true, secure: false, sameSite: 'Strict' });

    return res.status(200).json({ message: 'Token refreshed' });
  });
};

const protect = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded.username;
    return next();
  });
};

module.exports = {
  login, register, logout, refreshToken, protect,
};
