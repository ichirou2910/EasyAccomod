const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const checkAuth = require('../middleware/check-auth');

router.get('/', activityController.getAll);
router.get('/user/:user', activityController.getByName);

router.use(checkAuth);
router.post('/create', activityController.create);
router.delete('/blog/:blog_id', activityController.deleteByBlog);
router.delete('/comment/:cmt_id', activityController.deleteByComment);

module.exports = router;
