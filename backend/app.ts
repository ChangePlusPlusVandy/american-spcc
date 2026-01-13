import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import collectionRoutes from './routes/collectionRoutes';
import resourceRoutes from './routes/resourceRoutes';
import categoryLabelRoutes from './routes/categoryLabelsRoutes';
import externalResourcesRoutes from './routes/externalResourcesRoutes';
import resourceViewRoutes from './routes/resourceViewRoutes';
import internalHostedResourceRoutes from './routes/internalHostedResourcesRoutes';
import adminLogsRoutes from './routes/adminLogsRoutes';
import testS3Routes from './routes/testS3Routes';

const app = express();

const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origin === 'http://localhost:5173') return callback(null, true);
      if (
        origin.endsWith('.vercel.app') &&
        origin.includes('american-spcc')
      ) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(clerkMiddleware());
import { getAuth } from '@clerk/express';

app.get('/api/debug/auth', (req, res) => {
  const auth = getAuth(req);
  res.json(auth);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/labels', categoryLabelRoutes);
app.use('/api/externalResources', externalResourcesRoutes);
app.use('/resourceViews', resourceViewRoutes);
app.use('/api/internalHostedResources', internalHostedResourceRoutes);
app.use('/api/admin-logs', adminLogsRoutes);
app.use('/api/test', testS3Routes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
