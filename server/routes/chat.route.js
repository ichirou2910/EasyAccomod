const express = require('express');
const router = express.Router();
const fileUpload = require('../middleware/file-upload');
const chatController = require('../controllers/chat.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/user_id', chatController.getByOwnerID);

module.exports = router;
