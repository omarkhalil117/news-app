const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.post('/subscribe', userController.subscribe);
router.post('/unsubscribe', userController.unsubscribe);

router.get('/subscriptions', userController.getSubs);
router.get('/news', userController.getNews);
router.get('/logs', userController.getLogs);

module.exports = router;
