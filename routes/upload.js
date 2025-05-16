const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), uploadController.importEmployeeCSV);

module.exports = router;