import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (_req, res) => {
  res.status(200).send('OK')
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
