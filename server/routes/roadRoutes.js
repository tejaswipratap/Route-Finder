const express = require('express');
const router = express.Router();
const roadController = require('../controllers/roadController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.get('/', roadController.getRoads);
router.post('/', protectAdmin, roadController.addRoad);
router.put('/:id', protectAdmin, roadController.updateRoad);
router.delete('/:id', protectAdmin, roadController.deleteRoad);

module.exports = router;
