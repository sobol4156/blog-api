import { Router } from "express";
import { param, query, body } from 'express-validator'
import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import User from "@/models/user";
import authorize from "@/middlewares/authorize";
import getCurrentUser from "@/controllers/v1/user/get_current_user";

const router = Router();

router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser
)

export default router