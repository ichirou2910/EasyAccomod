const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/notice.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/filter', noticeController.getByContext);
router.get('/user/:user_id', noticeController.getByUser);
router.post('/mark/:count', noticeController.markByNumber);
router.get('/', noticeController.getAll);

module.exports = router;
