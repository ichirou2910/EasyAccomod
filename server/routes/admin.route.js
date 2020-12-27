const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/place', adminController.getUnapprovedPlaces);
router.get('/user', adminController.getUnapprovedUser);
router.get('/reports', adminController.getAll);
router.post('/grant_update', adminController.permit_update);
router.post('/grant_account', adminController.permit_account);
router.post('/confirm_extend', adminController.confirmExtend);
router.post('/confirm_place', adminController.confirm);
router.post('/comments/confirm/:comment_id');
router.delete('/delete/:place_id', adminController._deletePlace);
router.delete('/delete/:report_id', adminController._deleteReport);

module.exports = router;
