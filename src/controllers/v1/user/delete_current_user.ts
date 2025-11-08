import type { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import User from '@/models/user';

const deleteCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    await User.deleteOne({ _id: userId });

    logger.info('A user accoun has been deleted', {
      userId,
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while deleting current user account', err);
  }
};

export default deleteCurrentUser;
