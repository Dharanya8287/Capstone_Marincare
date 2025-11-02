import express from 'express';
import {
    getChallenges,
    getChallengeStats,
    // Assuming you have these controllers
} from '../controllers/challengeController.js';

// FIX: Import the correct function 'verifyFirebaseToken' instead of 'protect'
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes that anyone can access
router.get('/', getChallenges);
router.get('/stats', getChallengeStats);

// Protected route: Only authenticated users can create a challenges.
// FIX: Use 'verifyFirebaseToken' as the middleware here.
router.post('/', verifyFirebaseToken);

export default router;