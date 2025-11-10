import type { NextFunction, Request, Response } from 'express';

import { logger } from '@/lib/winston';
import Blog from '@/models/blog';
import User from '@/models/user';

const checkBlogAccess = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;
  const blogId = req.params.blogId;

  const user = await User.findById(userId).select('role').lean().exec();
  const blog = await Blog.findById(blogId)
    .select('-banner.publicId -__v')
    .populate('author', '-createdAt -updateAt -__v')
    .exec();

  if (!blog) {
    res.status(404).json({
      code: 'NotFound',
      message: 'Blog was not found',
    });
    logger.error('Blog was not found');

    return;
  }

  if (blog.author !== userId && user?.role !== 'admin') {
    res.status(403).json({
      code: 'AuthorizationError',
      message: 'Access denied, insufficient permissions',
    });
    logger.warn('A user tried to update a blog without permissions');

    return;
  }

  return next();
};

export default checkBlogAccess;
