const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkAuth = require('../middleware/check-auth');

// Routes
router.post('/register', userController.register);
router.post('/authenticate', userController.login);

router.use(checkAuth);
router.get('/', userController.getAll);
router.get('/:user_id', userController.getById);
router.post('/:user_id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
