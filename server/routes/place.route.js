const express = require('express');
const router = express.Router();
const fileUpload = require('../middleware/file-upload');
const placeController = require('../controllers/place.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/', placeController.getAll);
router.get('/:place_id', placeController.getById);
router.get('/user/:user_id', placeController.getByUser);
router.post('/create', fileUpload.single('image'), placeController.create);
router.delete('/:place_id', placeController.delete);
router.post('/:place_id', fileUpload.single('image'), placeController.update);
router.post('/extend/:place_id', placeController.extend);
router.post('/like/:place_id', placeController.like);

module.exports = router;
