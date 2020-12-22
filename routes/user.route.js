const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

// Routes
router.get('/', userController.getAll);
router.get('/:user_id', userController.getById);
router.get('/search/:name', userController.getByName);
router.get('/avatar/:name', userController.avatarByName);
router.post('/register', userController.register);
router.post('/authenticate', userController.login);

router.use(checkAuth);
router.post(
	'/:name',
	fileUpload.fields([
		{
			name: 'avatar',
			maxCount: 1,
		},
		{
			name: 'cover',
			maxCount: 1,
		},
	]),
	userController.update
);
router.delete('/:id', userController.delete);

module.exports = router;
