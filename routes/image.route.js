const express = require('express');
const router = express.Router();
const fileUpload = require('../middleware/file-upload');
const imageController = require('../controllers/image.controller');
const checkAuth = require('../middleware/check-auth');

router.get('/search', imageController.search);

router.use(checkAuth);
router.post('/upload', fileUpload.single('image'), imageController.upload);
router.delete('/:image_id', imageController.delete);

module.exports = router;
