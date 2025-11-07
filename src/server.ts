import express from 'express'
import config from '@/config'
import cors from 'cors'
import type { CorsOptions } from 'cors'

const app = express()

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false)
    }
  }
}

app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.json({
    message: 'Hi'
  })
})

app.listen(config.PORT, () => {
  console.log(`service running: http://localhost:${config.PORT}`)
})