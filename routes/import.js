const express = require('express');
const router = express.Router();
const importRouter = require('../controllers/import');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), importRouter.importEmployeeTechStackLevelCSV);

module.exports = router;