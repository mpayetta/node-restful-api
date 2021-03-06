import express from 'express';
import userRoutes from './user';
import authRoutes from './auth';

const router = express.Router();	// eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount authentication routes at /auth
router.use('/auth', authRoutes);
// mount user routes at /users
router.use('/users', userRoutes);

export default router;
