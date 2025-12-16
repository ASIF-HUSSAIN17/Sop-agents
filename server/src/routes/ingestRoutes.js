const express = require('express');
const multer = require('multer');
const { ingestFile } = require('../controllers/ingestController');

const router = express.Router();

// Determine storage (memory storage is good for parsing immediate uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), ingestFile);

module.exports = router;
