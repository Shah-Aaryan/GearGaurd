dotenv.config();
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { sequelize } from './models/User.js';

dotenv.config();

const app = express();
app.use(express.json());

sequelize.sync().then(() => {
  console.log('MySQL connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

app.use('/api/auth', authRoutes);
