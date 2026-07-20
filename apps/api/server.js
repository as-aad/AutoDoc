import express from 'express';
import cors from 'cors';
import vehicleRoutes from './src/routes/vehicles.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mount your vehicle routes
app.use('/api/vehicles', vehicleRoutes);

app.get('/', (req, res) => {
  res.send('AutoDoc API running...');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
