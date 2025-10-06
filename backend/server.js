import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import * as stammdatenRoutes from './routes/stammdaten.js';
import * as projekteRoutes from './routes/projekte.js';
import * as mitarbeiterRoutes from './routes/mitarbeiter.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/stammdaten', stammdatenRoutes);
app.use('/api/mitarbeiter', mitarbeiterRoutes);
app.use('/api/projekte', projekteRoutes);

app.listen(PORT, () => {
  console.log(`✅ Backend läuft auf http://localhost:${PORT}`);
});
