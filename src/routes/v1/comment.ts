import { Router } from 'express';
import { body, param } from 'express-validator';

import commentBlog from '@/controllers/v1/comment/comment_blog';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';
import deleteCommentBlog from '@/controllers/v1/comment/delete_comment_blog';
import getCommentBlog from '@/controllers/v1/comment/get_comment_blog';
import getAllCommentsBlog from '@/controllers/v1/comment/get_all_comments_blog';

const router = Router();

router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['user', 'admin']),
  param('blogId').isMongoId().withMessage('blogId is required'),
  validationError,
  getAllCommentsBlog,
);

router.get(
  '/:commentId',
  authenticate,
  authorize(['user', 'admin']),
  param('commentId').isMongoId().withMessage('commentId is required'),
  validationError,
  getCommentBlog,
);

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['user', 'admin']),
  param('blogId').isMongoId().withMessage('blogId is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validationError,
  commentBlog,
);

router.delete(
  '/blog/:commentId',
  authenticate,
  authorize(['user', 'admin']),
  param('commentId').isMongoId().withMessage('commentId is required'),
  validationError,
  deleteCommentBlog,
);

export default router;
