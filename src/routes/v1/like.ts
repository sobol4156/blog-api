import { Router } from 'express';
import { param } from 'express-validator';

import likeBlog from '@/controllers/v1/like/like_blog';
import unLikeBlog from '@/controllers/v1/like/unlike_blog';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('blogId is required'),
  validationError,
  likeBlog,
);

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('blogId is required'),
  validationError,
  unLikeBlog,
);

export default router;
