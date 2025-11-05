import express, { Request, Response } from 'express';

const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.get('/health', (req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

app.listen(PORT, (): void => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

