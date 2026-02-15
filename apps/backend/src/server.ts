import '../lib/load-env.js';
import cors from 'cors';
import express from 'express';

import { prisma } from '../lib/prisma.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get('/tickets', async (req, res) => {
  const tickets = await prisma.ticket.findMany();

  res.json(tickets);
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
