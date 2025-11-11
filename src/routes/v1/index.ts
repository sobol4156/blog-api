import { Router } from 'express';

import authRouter from '@/routes/v1/auth';
import blogRouter from '@/routes/v1/blog';
import commentRouter from '@/routes/v1/comment';
import likesRouter from '@/routes/v1/like';
import userRouter from '@/routes/v1/user';

const router = Router();

/**
 * GET /v1
 * Healthcheck endpoint for API status/version.
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API IS LIVE',
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount sub-routers
// /v1/auth - authentication endpoints (register, login, refresh, logout)
router.use('/auth', authRouter);
// /v1/users - user management endpoints (admin listing, profile, updates)
router.use('/users', userRouter);
// /v1/blogs - blog CRUD endpoints
router.use('/blogs', blogRouter);
// /v1/likes - blog like/unlike endpoints
router.use('/likes', likesRouter);
// /v1/comments - blog comment endpoints
router.use('/comments', commentRouter);

export default router;
