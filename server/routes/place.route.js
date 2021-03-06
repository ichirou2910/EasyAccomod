const express = require('express');
const router = express.Router();
const fileUpload = require('../middleware/file-upload');
const placeController = require('../controllers/place.controller');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/', placeController.getAll);
router.get('/:place_id', placeController.getById);
router.get('/user/:user_id', placeController.getByUser);
router.post('/create', fileUpload.any(), placeController.create);
router.delete('/:place_id', placeController.delete);
router.post('/:place_id', fileUpload.any(), placeController.update);
router.post('/extend/:place_id', placeController.extend);
router.post('/like/:place_id', placeController.like);
router.post('/unlike/:place_id', placeController.unlike);
router.post('/rented/:place_id', placeController.rented);
router.get('/stat/:place_id', placeController.getStatistics);

module.exports = router;
