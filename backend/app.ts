import express from 'express';
import cors from 'cors';
import resourceRoutes from './routes/resourceRoutes';
import categoryLabelRoutes from './routes/categoryLabelsRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/resources', resourceRoutes);
app.use('/api/labels', categoryLabelRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

export default app;
