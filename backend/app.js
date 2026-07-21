import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import garagesRouter from './routes/garages.routes.js';
import mechanicsRouter from './routes/mechanics.routes.js';
import serviceRequestsRouter from './routes/service-requests.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const prisma = new PrismaClient();

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

app.use('/api/admin/garages', garagesRouter);
app.use('/api/admin/mechanics', mechanicsRouter);
app.use('/api/service-requests', serviceRequestsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
