import express from 'express'
import config from './config'

const app = express()

app.listen(config.PORT, () => {
  console.log(`service running: http://localhost:${config.PORT}`)
})