import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes'; // ✅ no .js extension

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/users', userRoutes);
console.log('✅ User routes mounted at /api/users');

app.get('/', (req, res) => res.send('API running ✅'));

// ✅ Export only the app (no app.listen() here)
export default app;
