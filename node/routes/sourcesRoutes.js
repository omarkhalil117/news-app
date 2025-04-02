const express = require('express');
const sourceController = require('../controllers/sourceControllers');

const router = express.Router();

router.get('/', sourceController.getAll);

router.get('/top-sources', sourceController.topSources);

module.exports = router;
