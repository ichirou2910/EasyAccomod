const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const checkAuth = require('../middleware/check-auth');

router.get('/:place_id', commentController.getById);

router.use(checkAuth);

router.post('/:place_id', commentController.addComment);
router.delete('/delete/:comment_id', commentController._delete);

module.exports = router;
