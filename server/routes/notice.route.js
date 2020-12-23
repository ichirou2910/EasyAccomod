const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/notice.controller');

router.get('/user/notices', noticeController.getAll);
router.post('/user/create_notice', noticeController.create);

module.exports = router;
