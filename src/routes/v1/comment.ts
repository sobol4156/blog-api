import { Router } from 'express';
import { body, param } from 'express-validator';

import commentBlog from '@/controllers/v1/comment/comment_blog';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['user', 'admin']),
  param('blogId').isMongoId().withMessage('blogId is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validationError,
  commentBlog,
);

export default router;
