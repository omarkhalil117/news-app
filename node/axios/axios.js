const axios = require('axios');

const axiosInstance = axios.create({
  baseURL: 'https://newsapi.org/v2/everything',
});

module.exports = axiosInstance;
