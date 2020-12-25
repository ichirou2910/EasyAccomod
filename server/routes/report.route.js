const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/reports/:user', reportController.getByUser);
router.get('/reports/:report_id', reportController.getById);
router.post('/reports/create/:user_id', reportController.create);
router.delete('/report/:place_id', reportController.delete);

module.exports = router;
