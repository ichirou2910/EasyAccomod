const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');

router.get('/:user_id', favoriteController.getByUser);

router.delete('/user/:place_id', favoriteController.delete);

module.exports = router;
