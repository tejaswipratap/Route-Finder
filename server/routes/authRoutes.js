const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', authController.loginAdmin);
router.post('/logout', authController.logoutAdmin);
router.get('/me', protectAdmin, authController.getMe);

module.exports = router;
