import express from 'express';
import {
    getChallenges,
    getChallengeStats,
    getChallengeById,
    joinChallenge,
    leaveChallenge,
    getJoinedChallenges,
} from '../controllers/challengeController.js';

import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import { ensureUserExists } from '../middleware/userMiddleware.js';

const router = express.Router();

// Public routes that anyone can access
router.get('/', getChallenges);
router.get('/stats', getChallengeStats);

// Protected routes - require authentication
// Get joined challenges (must come before /:id to avoid route conflict)
router.get('/joined', verifyFirebaseToken, ensureUserExists, getJoinedChallenges);

// Get single challenge by ID
router.get('/:id', getChallengeById);

// Join a challenge
router.post('/:id/join', verifyFirebaseToken, ensureUserExists, joinChallenge);

// Leave a challenge
router.post('/:id/leave', verifyFirebaseToken, ensureUserExists, leaveChallenge);

export default router;