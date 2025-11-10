import type { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import Comment from '@/models/comment';

const getAllCommentsBlog = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params;

  try {
    const comments = await Comment.find({ blogId }).lean().exec();

    res.status(200).json({
      data: comments ?? [],
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while blog comments', err);
  }
};

export default getAllCommentsBlog;
