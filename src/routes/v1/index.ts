import { Router } from 'express';

import authRouter from '@/routes/v1/auth';
import blogRouter from '@/routes/v1/blog';
import userRouter from '@/routes/v1/user';
import likesRouter from '@/routes/v1/like';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API IS LIVE',
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/blogs', blogRouter);
router.use('/likes', likesRouter)

export default router;
