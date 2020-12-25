const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/:user', reportController.getByUser);
router.get('/:report_id', reportController.getById);
router.post('/create/:user_id', reportController.create);
router.delete('/:place_id', reportController.delete);

module.exports = router;
