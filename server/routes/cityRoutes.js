const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', cityController.getCities);
router.post('/', protectAdmin, cityController.addCity);
router.put('/:id', protectAdmin, cityController.updateCity);
router.delete('/:id', protectAdmin, cityController.deleteCity);

module.exports = router;
