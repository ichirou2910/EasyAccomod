const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/get_unapporved_place/', adminController.getUnapprovedPlaces);
router.get('/get_unapporved_user/', adminController.getUnapprovedUser);
router.post('/grant_update/', adminController.permit_update);
router.post('/grant_account/', adminController.permit_account);
router.post('/confirm_extend/', adminController.confirmExtend);
router.post('/confirm/', adminController.confirm);

module.exports = router;
