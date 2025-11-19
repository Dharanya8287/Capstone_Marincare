import express from 'express';
import {
    getChallenges,
    getChallengeStats,
    getChallengeById,
    joinChallenge,
    leaveChallenge,
    getJoinedChallenges,
} from '../controllers/challengeController.js';

import { verifyAuth } from '../middleware/authMiddleware.js';
import { ensureUserExists } from '../middleware/userMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes that anyone can access - add rate limiting to prevent abuse
router.get('/', rateLimiter, getChallenges);
router.get('/stats', rateLimiter, getChallengeStats);

// Protected routes - require authentication
// Get joined challenges (must come before /:id to avoid route conflict)
router.get('/joined', verifyAuth, ensureUserExists, getJoinedChallenges);

// Get single challenge by ID - add rate limiting
router.get('/:id', rateLimiter, getChallengeById);

// Join a challenge - already has auth which provides rate limiting
router.post('/:id/join', verifyAuth, ensureUserExists, joinChallenge);

// Leave a challenge - already has auth which provides rate limiting
router.post('/:id/leave', verifyAuth, ensureUserExists, leaveChallenge);

export default router;