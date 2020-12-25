const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);


router.get('/:user_id', favoriteController.getById);
router.post('/:user_id', favoriteController.add);
router.delete('/:place_id', favoriteController.delete);

module.exports = router;
