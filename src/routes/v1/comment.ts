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

/**
 * GET /v1/comments/blog/:blogId
 * Returns a paginated list of comments for a specific blog post.
 * Requires authentication and either admin or user role.
 */
router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['user', 'admin']),
  param('blogId').isMongoId().withMessage('blogId is required'),
  validationError,
  getAllCommentsBlog,
);

/**
 * GET /v1/comments/:commentId
 * Returns a single comment by its ID.
 * Requires authentication and either admin or user role.
 */
router.get(
  '/:commentId',
  authenticate,
  authorize(['user', 'admin']),
  param('commentId').isMongoId().withMessage('commentId is required'),
  validationError,
  getCommentBlog,
);

/**
 * POST /v1/comments/blog/:blogId
 * Creates a new comment on a specific blog post.
 * Body: { content: string }
 * Requires authentication and either admin or user role.
 */
router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['user', 'admin']),
  param('blogId').isMongoId().withMessage('blogId is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validationError,
  commentBlog,
);

/**
 * DELETE /v1/comments/blog/:commentId
 * Deletes a comment by its ID from a blog post.
 * Requires authentication and either admin or user role.
 */
router.delete(
  '/blog/:commentId',
  authenticate,
  authorize(['user', 'admin']),
  param('commentId').isMongoId().withMessage('commentId is required'),
  validationError,
  deleteCommentBlog,
);

export default router;
