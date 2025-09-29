const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    updateDetails,
    updatePassword
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);

module.exports = router;