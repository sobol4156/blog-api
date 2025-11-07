import { logger } from '@/lib/winston'
import User from '@/models/user'
import config from '@/config'
import { genUsername } from '@/utils'

import type { IUser } from '@/models/user'
import type { Request, Response } from 'express'

type UserData = Pick<IUser, 'email' | 'password' | 'role'>

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as UserData

  console.log(email, password, role)

  try {
    const username = genUsername();

    const newUser = await User.create({
      username,
      email,
      password,
      role
    })

    res.status(201).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      message: 'New user created'
    })
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: "Internal server error",
      error: err
    })

    logger.error(`Error during user registration ${err}`)
  }
}

export default register