import express from 'express';
import cors from 'cors';
import resourceRoutes from './routes/resourcesRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Mount resource routes
app.use('/api/resources', resourceRoutes);
console.log('✅ Resource routes mounted at /api/resources');

app.get('/', (req, res) => res.send('API running ✅'));

export default app;
