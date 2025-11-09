import { DOMPurify } from 'dompurify';
import type { Request, Response } from 'express';
import { JSDOM } from 'jsdom';

import { logger } from '@/lib/winston';
import User from '@/models/user';

const createBlog = async (req: Request, res: Response): Promise<void> => {};

export default createBlog;
