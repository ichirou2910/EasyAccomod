const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const checkAuth = require('../middleware/check-auth');

router.get('/blog/:blog_id', commentController.getByBlog);

router.use(checkAuth);
router.post('/', commentController.create);
router.delete('/blog/:blog_id', commentController.deleteByBlog);
router.delete('/:cmt_id', commentController.deleteById);

module.exports = router;
