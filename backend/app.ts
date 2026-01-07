import express from 'express'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'

import collectionRoutes from './routes/collectionRoutes'
import resourceRoutes from './routes/resourceRoutes'
import categoryLabelRoutes from './routes/categoryLabelsRoutes'
import externalResourcesRoutes from './routes/externalResourcesRoutes'
import userRoutes from './routes/userRoutes'
import resourceViewRoutes from './routes/resourceViewRoutes'
import internalHostedResourceRoutes from './routes/internalHostedResourcesRoutes'
import adminLogsRoutes from './routes/adminLogsRoutes'
import testS3Routes from './routes/testS3Routes'

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://american-spcc-frontend.vercel.app',
      'https://american-spcc-frontend-dev.vercel.app',
    ],
    credentials: true,
  })
)

// Clerk is fine here
app.use(clerkMiddleware())

// health check (always keep this)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// routes
app.use('/api/resources', resourceRoutes)
app.use('/api/labels', categoryLabelRoutes)
app.use('/api/externalResources', externalResourcesRoutes)
app.use('/api/users', userRoutes)
app.use('/resourceViews', resourceViewRoutes)
app.use('/api/internalHostedResources', internalHostedResourceRoutes)
app.use('/api/admin-logs', adminLogsRoutes)
app.use('/api/test', testS3Routes)
app.use('/api/collections', collectionRoutes)

export default app
