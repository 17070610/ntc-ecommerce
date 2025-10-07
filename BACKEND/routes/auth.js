import express from 'express';
import { register, login, logout, getMe, updateDetails, updatePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ================================
// PUBLIC ROUTES - NO AUTHENTICATION
// ================================
router.post('/register', register);
router.post('/login', login);

// ================================
// PROTECTED ROUTES - REQUIRES AUTHENTICATION
// ================================
// Everything below this line requires authentication
router.use(protect);

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);

export default router;