import { Router } from 'express';
import { body, param, query } from 'express-validator';

import deleteCurrentUser from '@/controllers/v1/user/delete_current_user';
import deleteUserById from '@/controllers/v1/user/delete_user_by_id';
import getAllUser from '@/controllers/v1/user/get_all_user';
import getCurrentUser from '@/controllers/v1/user/get_current_user';
import getUserById from '@/controllers/v1/user/get_user_by_id';
import updateCurrentUser from '@/controllers/v1/user/update_current_user';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';
import User from '@/models/user';

const router = Router();

/**
 * GET /v1/users
 * Returns a paginated list of users.
 * Query: limit (1..50), offset (>=0)
 * Requires admin role.
 */
router.get(
  '',
  authenticate,
  authorize(['admin']),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 to 50'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'),
  validationError,
  getAllUser,
);

/**
 * GET /v1/users/:userId
 * Returns details of a user by ID.
 * Requires admin role.
 */
router.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
  validationError,
  getUserById,
);

/**
 * DELETE /v1/users/:userId
 * Deletes a user by ID.
 * Requires admin role.
 */
router.delete(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
  validationError,
  deleteUserById,
);

/**
 * GET /v1/users/current
 * Returns the currently authenticated user's profile.
 * Requires role: admin or user.
 */
router.get('/current', authenticate, authorize(['admin', 'user']), getCurrentUser);

/**
 * PUT /v1/users/current
 * Updates the currently authenticated user's profile.
 * Body: optional username, email, password, first_name, last_name, links
 * Requires role: admin or user.
 */
router.put(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  body('username')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Username must be less than 20 characters')
    .custom(async (value) => {
      const userExists = await User.exists({ username: value });

      if (userExists) {
        throw new Error('This username is already in use');
      }
    }),
  body('email')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });

      if (userExists) {
        throw new Error('This email is already in use');
      }
    }),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('first_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'),
  body('last_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'),
  body(['website', 'facebook', 'instagram', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('Invalid URL')
    .isLength({ max: 100 })
    .withMessage('Url must be less than 100 characters'),
  validationError,
  updateCurrentUser,
);

/**
 * DELETE /v1/users/current
 * Deletes the currently authenticated user's account.
 * Requires role: admin or user.
 */
router.delete('/current', authenticate, authorize(['admin', 'user']), deleteCurrentUser);

export default router;
