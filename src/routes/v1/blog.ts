import { Router } from 'express';
import { body, param, query } from 'express-validator';
import multer from 'multer';

import createBlog from '@/controllers/v1/blog/create_blog';
import deleteBlogById from '@/controllers/v1/blog/delete_blog_by_id';
import getAllBlogs from '@/controllers/v1/blog/get_all_blogs';
import getBlogBySlug from '@/controllers/v1/blog/get_blog_by_slug';
import getBlogsByUser from '@/controllers/v1/blog/get_blogs_by_user';
import updateBlog from '@/controllers/v1/blog/update_blog';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';
import validationError from '@/middlewares/validationError';

const upload = multer();

const router = Router();

/**
 * POST /v1/blogs
 * Creates a new blog post.
 * Form-Data: title (string), content (string), status ('draft' | 'published'), banner_image (file)
 * Requires authentication and role: admin or user.
 */
router.post(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  upload.single('banner_image'),
  uploadBlogBanner('post'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or published'),
  validationError,
  createBlog,
);

/**
 * GET /v1/blogs
 * Returns a paginated list of blogs.
 * Query: limit (1..50), offset (>=0)
 * Requires authentication and role: admin or user.
 */
router.get(
  '',
  authenticate,
  authorize(['admin', 'user']),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 to 50'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'),
  validationError,
  getAllBlogs,
);

/**
 * GET /v1/blogs/user/:userId
 * Returns a paginated list of blogs authored by a specific user.
 * Query: limit (1..50), offset (>=0)
 * Requires authentication and role: admin or user.
 */
router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'user']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 to 50'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'),
  validationError,
  getBlogsByUser,
);

/**
 * GET /v1/blogs/:slug
 * Returns a single blog by its slug.
 * Requires authentication and role: admin or user.
 */
router.get('/:slug', authenticate, authorize(['admin', 'user']), validationError, getBlogBySlug);

/**
 * PUT /v1/blogs/:blogId
 * Updates a blog post by ID.
 * Form-Data: optional title, content, status, banner_image (file)
 * Requires authentication and role: admin or user.
 */
router.put(
  '/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').notEmpty().isMongoId().withMessage('Invalid Blog ID'),
  upload.single('banner_image'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content').optional(),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or published'),
  validationError,
  uploadBlogBanner('put'),
  updateBlog,
);

/**
 * DELETE /v1/blogs/:blogId
 * Deletes a blog post by ID.
 * Requires authentication and role: admin or user.
 */
router.delete(
  '/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').notEmpty().isMongoId().withMessage('Invalid Blog ID'),
  validationError,
  deleteBlogById,
);

export default router;
