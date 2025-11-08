import { Request } from './../../../node_modules/express-validator/lib/base.d';
import * as express from 'express'
import { Types } from 'mongoose'

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId
    }
  }
}