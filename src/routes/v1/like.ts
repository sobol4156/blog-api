import { Router } from 'express';
import { param } from 'express-validator';

import likeBlog from '@/controllers/v1/like/like_blog';
import unLikeBlog from '@/controllers/v1/like/unlike_blog';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';

const router = Router();

/**
 * POST /v1/likes/blog/:blogId
 * Adds a like to a blog post.
 * Requires authentication and role: admin or user.
 */
router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('blogId is required'),
  validationError,
  likeBlog,
);

/**
 * DELETE /v1/likes/blog/:blogId
 * Removes a like from a blog post.
 * Requires authentication and role: admin or user.
 */
router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('blogId is required'),
  validationError,
  unLikeBlog,
);

export default router;
