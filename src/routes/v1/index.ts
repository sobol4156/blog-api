import { Router } from 'express'
import authRouter from '@/routes/v1/auth'

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API IS LIVE',
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

router.use('/auth', authRouter)

export default router