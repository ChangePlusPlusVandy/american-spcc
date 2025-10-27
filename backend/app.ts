import express from 'express';
import cors from 'cors';
import resourceRoutes from './routes/resourceRoutes';
import internalHostedResourceRoutes from './routes/internalHostedResourceRoutes';
import categoryLabelRoutes from './routes/categoryLabelsRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/resources', resourceRoutes);
app.use('/api/internalHostedResources', internalHostedResourceRoutes);
app.use('/api/labels', categoryLabelRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;
