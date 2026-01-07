import express from 'express'
import cors from 'cors'

import resourceRoutes from './routes/resourceRoutes'
import categoryLabelRoutes from './routes/categoryLabelsRoutes'
import externalResourcesRoutes from './routes/externalResourcesRoutes'
import userRoutes from './routes/userRoutes'
import resourceViewRoutes from './routes/resourceViewRoutes'
import internalHostedResourceRoutes from './routes/internalHostedResourcesRoutes'
import adminLogsRoutes from './routes/adminLogsRoutes'
import testS3Routes from './routes/testS3Routes'
import authRoutes from './routes/authRoutes'
import { clerkMiddleware } from '@clerk/express'

const app = express()

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      // Local dev
      if (origin === 'http://localhost:5173') {
        return callback(null, true)
      }

      // Canonical frontend
      if (origin === process.env.FRONTEND_URL) {
        return callback(null, true)
      }

      // Any Vercel deployment of your frontend
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)


app.use(express.json())
app.post('/api/auth/__ping', (req, res) => {
  console.log('🧪 AUTH PING HIT');
  res.json({ ok: true });
});

app.get('/', (_req, res) => {
  res.status(200).send('OK')
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes) 
app.use('/api/resources', resourceRoutes)
app.use('/api/labels', categoryLabelRoutes)
app.use('/api/externalResources', externalResourcesRoutes)
app.use('/api/users', userRoutes)
app.use('/resourceViews', resourceViewRoutes)
app.use('/api/internalHostedResources', internalHostedResourceRoutes)
app.use('/api/admin-logs', adminLogsRoutes)
app.use('/api/test', testS3Routes)

export default app
