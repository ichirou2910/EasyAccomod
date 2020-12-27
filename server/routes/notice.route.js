const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/notice.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/:context_id', noticeController.getByContext);
router.get('/', noticeController.getAll);

module.exports = router;
