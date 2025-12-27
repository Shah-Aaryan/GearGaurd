
import express from 'express';
import { signup, signin } from '../controllers/authController.js';

const router = express.Router();

// Sign Up
router.post('/signup', signup);
// Sign In
router.post('/signin', signin);

export default router;
