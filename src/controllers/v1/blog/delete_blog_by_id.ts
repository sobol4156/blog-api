import type { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import User from '@/models/user';
import Blog from '@/models/blog';
import { Types } from 'mongoose';

const deleteBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const blogId = req.params.blogId;

    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).select('author').lean().exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    if (userId?.toString() !== blog.author?.toString() && user.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });
      return;
    }

    await Blog.deleteOne({ _id: blogId });

    logger.info('A blog has been deleted', {
      blogId,
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while deleting blog by id', err);
  }
};

export default deleteBlogById;
