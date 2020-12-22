const express = require('express');
const router = express.Router();
const fileUpload = require('../middleware/file-upload');
const blogController = require('../controllers/blog.controller');
const checkAuth = require('../middleware/check-auth');

router.get('/', blogController.getAll);
router.get('/:blog_id', blogController.getById);
router.get('/user/:user', blogController.getByUser);

router.use(checkAuth);

router.post('/create', fileUpload.single('cover'), blogController.create);
router.delete('/:blog_id', blogController.delete);
router.post('/:blog_id', fileUpload.single('cover'), blogController.update);

module.exports = router;
