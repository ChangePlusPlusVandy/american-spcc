import express from 'express'
import cors from 'cors'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

app.use(express.json())

app.get('/', (_req, res) => {
  res.status(200).send('OK')
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
