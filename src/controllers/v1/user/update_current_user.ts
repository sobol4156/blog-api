import type { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import User from '@/models/user';

const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const {
    username,
    email,
    password,
    first_name,
    last_name,
    website,
    facebook,
    instagram,
    x,
    youtube,
  } = req.body;

  try {
    const user = await User.findById(userId).select('+password -__v').exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User was not found',
      });
      logger.error('User was not found');

      return;
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (first_name) user.firstName = first_name;
    if (last_name) user.lastName = last_name;
    if (!user.socialLinks) {
      user.socialLinks = {};
    }

    if (website) user.socialLinks.website = website;
    if (facebook) user.socialLinks.facebook = facebook;
    if (instagram) user.socialLinks.instagram = instagram;
    if (x) user.socialLinks.x = x;
    if (youtube) user.socialLinks.youtube = youtube;

    await user.save();

    logger.info('User update successfully', user);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while updating current user', err);
  }
};

export default updateCurrentUser;
