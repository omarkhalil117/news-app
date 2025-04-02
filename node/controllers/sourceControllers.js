const Source = require('../models/Source');
const catchAsync = require('../utils/catchAsync');
const client = require('../redisClient');

const getAll = catchAsync(async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const offset = (page - 1) * limit;

  const key = `sources:${page}:${limit}`;
  const result = await client.get(key);
  const total = await Source.countDocuments();

  if (result) {
    return res.json({ total, sources: JSON.parse(result) });
  }

  const sourcesDB = await Source.find({}).skip(offset).limit(limit);
  await client.set(key, JSON.stringify(sourcesDB));

  return res.json({ total, sources: sourcesDB });
});

const topSources = catchAsync(async (req, res) => {
  const sources = await Source.aggregate([
    { $sort: { subCount: -1 } },
    { $limit: 6 },
  ]);

  res.json({ sources });
});

module.exports = { getAll, topSources };
