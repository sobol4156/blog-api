import DOMPurify from 'dompurify';
import type { Request, Response } from 'express';
import { JSDOM } from 'jsdom';

import { logger } from '@/lib/winston';
import Blog, { IBlog } from '@/models/blog';
import User from '@/models/user';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const blogId = req.params.blogId
    const {
      title,
      content,
      banner,
      status,
    } = req.body as BlogData;

    const blog = await Blog
      .findById(blogId)
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updateAt -__v')
      .exec()


    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog was not found',
      });
      logger.error('Blog was not found');

      return
    }

    if (title) blog.title = title
    if (content) {
      const cleanContent = purify.sanitize(content);
      blog.content = cleanContent
    }
    if (banner) blog.banner = banner
    if (status) blog.status = status


    await blog.save();

    logger.info('Blog updated', { blog });
    res.status(200).json({ blog });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });

    logger.error('Error while updating current user', err);
  }
};

export default updateBlog;
