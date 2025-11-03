import express from 'express';
import cors from 'cors';
import resourceRoutes from './routes/resourceRoutes';
import categoryLabelRoutes from './routes/categoryLabelsRoutes';
import externalResourcesRoutes from './routes/externalResourcesRoutes';
import userRoutes from './routes/userRoutes';
import bookmarkRoutes from './routes/bookmarkRoutes';
import resourceViewRoutes from './routes/resourceViewRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/resources', resourceRoutes);
app.use('/api/labels', categoryLabelRoutes);
app.use('/api/externalResources', externalResourcesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/resourceViews', resourceViewRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;
