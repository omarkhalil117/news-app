const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const axiosInstance = require('../axios/axios');
const client = require('../redisClient');
const Source = require('../models/Source');

const subscribe = catchAsync(async (req, res) => {
  const { source } = req.body;
  if (!source) {
    return res.status(400).json({ message: 'No source provided ?' });
  }

  const { email } = jwt.decode(req.cookies.token);

  const user = await User.findOneAndUpdate(
    { email },
    { $addToSet: { subscriptions: source } },
    { new: true, useFindAndModify: false },
  );

  await Source.findOneAndUpdate(
    { id: source },
    { $inc: { subCount: 1 } },
    { useFindAndModify: false },
  );

  const key = `user:${user._id}:subsUpdated`;
  await client.set(key, 'true');

  return res.status(200).json({ message: 'Subscribed Successfully !' });
});

const unsubscribe = catchAsync(async (req, res) => {
  const { source } = req.body;

  if (!source) {
    return res.status(400).json({ message: 'No source provided ?' });
  }

  const { email } = jwt.decode(req.cookies.token);

  const user = await User.findOneAndUpdate(
    { email },
    { $pull: { subscriptions: source } },
    { useFindAndModify: false },
  );

  await Source.findOneAndUpdate(
    { id: source },
    { $inc: { subCount: -1 } },
    { useFindAndModify: false },
  );

  const key = `user:${user._id}:subsUpdated`;
  await client.set(key, 'true');

  return res.status(200).json({ message: 'Unsubscribed Successfully !' });
});

const getSubs = catchAsync(async (req, res) => {
  const { id } = jwt.decode(req.cookies.token);
  const user = await User.findOne({ _id: id });

  if (!user) {
    res.status(400).json({ message: 'User not found !!' });
  }
  res.json({ subscriptions: user.subscriptions });
});

const getNews = catchAsync(async (req, res) => {
  const { id } = jwt.decode(req.cookies.token);
  const page = +req.query.page || 1;
  const key = `user:${id}:News:${page}`;
  const updateKey = `user:${id}:subsUpdated`;
  const news = await client.get(key);
  const user = await User.findOne({ _id: id });
  const updated = await client.get(updateKey);

  if (!user) {
    return res.status(400).json({ message: 'User not found !!' });
  }

  if (news && updated === 'false') {
    return res.json({ message: 'success', data: JSON.parse(news) });
  }

  if (user.subscriptions.length === 0) {
    return res.status(200).json({ message: 'There is no news', data: { articles: [] } });
  }

  // clear all cached pages
  for (let i = 1; i <= 10; i++) {
    client.del(`user:${id}:News:${i}`);
  }

  const response = await axiosInstance.get('/', {
    params: {
      sources: user.subscriptions.join(','),
      pageSize: 12,
      page,
      apiKey: process.env.NEWS_API_KEY,
    },
  });

  await client.set(key, JSON.stringify(response.data), { EX: 3600 });
  await client.set(updateKey, 'false');

  return res.json({ message: 'Ok', data: response.data });
});

const getLogs = catchAsync(async (req, res) => {
  const { id } = jwt.decode(req.cookies.token);

  const logs = await User.findOne({ _id: id }, { logs: 1, _id: 0 })

  return res.json({ logs });
});

module.exports = {
  subscribe, unsubscribe, getSubs, getNews, getLogs,
};
