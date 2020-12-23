const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.get('/reports', reportController.getAll_admin);
router.get('/reports/:user', reportController.getAll);
router.post('/reports/create/:user_id', reportController.create);
router.delete('/report/:place_id', reportController.delete);

module.exports = router;
