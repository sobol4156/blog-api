import type { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import Comment from '@/models/comment';

const getCommentBlog = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId).lean().exec();

    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
      });
      return;
    }

    res.status(200).json({
      comment,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error durring comment blog', err);
  }
};

export default getCommentBlog;
