import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { auth } from './middleware/auth.js';
import { signinLimiter, signupLimiter } from './middleware/limiter.js';
import { createUser, login } from './controllers/users.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Vercel pone un proxy delante: confiamos solo en ese primero
app.set('trust proxy', 1);

mongoose
  .connect(process.env.MONGO_URI!, { maxPoolSize: 10 })
  .then(() => console.warn('Conectado a la base de datos'))
  .catch((err) => console.error('Error al conectar a MongoDB', err));

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de estado: responde siempre igual, sin base de datos ni token
app.get('/health', (_req, res) => {
  res.status(200).send({ status: 'ok' });
});

// Rutas abiertas: son las que entregan el token
app.post('/signup', signupLimiter, createUser);
app.post('/signin', signinLimiter, login);

// A partir de aquí, todas las rutas exigen token
app.use(auth);

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.warn(`Servidor ejecutándose en el puerto ${PORT}`);
});

export default app;
