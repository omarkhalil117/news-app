const mongoose = require('mongoose');

const SourceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  subCount: {
    type: Number,
    default: 0,
  },
});

const Source = mongoose.model('Source', SourceSchema);
module.exports = Source;
