const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/:place_id', commentController.getById);
router.post('/add', commentController.addComment);
router.delete('/delete/:comment_id', commentController._delete);

module.exports = router;
