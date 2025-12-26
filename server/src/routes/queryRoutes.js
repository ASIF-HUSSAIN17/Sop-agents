const express = require('express');
const { handleQuery } = require('../controllers/queryController');

const router = express.Router();

router.post('/query', handleQuery);

module.exports = router;
