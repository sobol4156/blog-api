import type { Request, Response } from 'express';

import config from '@/config';
import { logger } from '@/lib/winston';
import Blog from '@/models/blog';
import User from '@/models/user';

const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogSlug = req.params.slug;
    const userId = req.userId;

    const user = await User.findById(userId).select('role').lean().exec();
    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    const blog = await Blog.findOne({ slug: blogSlug })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updateAt -__v')
      .lean()
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (user?.role === 'user' && blog.status === 'draft') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });

      logger.warn('A user trie to access a draft blog', {
        userId,
        blog,
      });

      return;
    }

    res.status(200).json({
      blog,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while fetching blog by slug', err);
  }
};

export default getBlogBySlug;
