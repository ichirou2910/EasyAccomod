const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/place', adminController.getUnapprovedPlaces);
router.get('/user', adminController.getUnapprovedUser);
router.get('/reports', adminController.getAll);
router.post('/grant_update/:user_id', adminController.permit_update);
router.post('/grant_account/:user_id', adminController.permit_account);
router.post('/confirm_extend', adminController.confirmExtend);
router.post('/confirm_place', adminController.confirm);
router.post('/comments/confirm/:comment_id', adminController.approveComment);
router.delete('/delete_place/:place_id', adminController._deletePlace);
router.delete('/delete_report/:report_id', adminController._deleteReport);

module.exports = router;
