import { Router } from 'express';
import { body, param, query } from 'express-validator';
import multer from 'multer';

import createBlog from '@/controllers/v1/blog/create_blog';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';
import validationError from '@/middlewares/validationError';
import getAllBlogs from '@/controllers/v1/blog/get_all_blogs';
import getBlogsByUser from '@/controllers/v1/blog/get_blogs_by_user';
import getBlogBySlug from '@/controllers/v1/blog/get_blog_by_slug';

const upload = multer();

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
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

router.get(
  '',
  authenticate,
  authorize(['admin', 'user']),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 to 50'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'),
  validationError,
  getAllBlogs,
);

router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'user']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 to 50'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'),
  validationError,
  getBlogsByUser
)

router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  validationError,
  getBlogBySlug
)

export default router;
