const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/user/:user_id', reportController.getByUser);
router.get('/:report_id', reportController.getById);
router.post('/create', reportController.create);

module.exports = router;
