import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';

import resourceRoutes from './routes/resourceRoutes';
import categoryLabelRoutes from './routes/categoryLabelsRoutes';
import externalResourcesRoutes from './routes/externalResourcesRoutes';
import userRoutes from './routes/userRoutes';
import resourceViewRoutes from './routes/resourceViewRoutes';
import internalHostedResourceRoutes from './routes/internalHostedResourcesRoutes';
import adminLogsRoutes from './routes/adminLogsRoutes';

const app = express();


const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true, 
  })
);


app.use(express.json());
app.use(clerkMiddleware()); 


app.use('/api/resources', resourceRoutes);
app.use('/api/labels', categoryLabelRoutes);
app.use('/api/externalResources', externalResourcesRoutes);
app.use('/api/users', userRoutes);
app.use('/resourceViews', resourceViewRoutes);
app.use('/api/internalHostedResources', internalHostedResourceRoutes);
app.use('/api/admin-logs', adminLogsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
