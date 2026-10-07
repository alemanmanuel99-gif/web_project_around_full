import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';
import User from './models/user.js';

const app = express();
const PORT = 3001;

const DEMO_USER_ID = '6ab071665e3bffbe52a9bee7';

async function ensureDemoUser(): Promise<void> {
  const existingUser = await User.findById(DEMO_USER_ID);
  if (existingUser) return;

  await User.create({
    _id: DEMO_USER_ID,
    name: 'Jacques Cousteau',
    about: 'Explorador',
    avatar: 'https://i.pravatar.cc/300?img=12',
  });
  console.warn('Usuario de demostración creado');
}

mongoose
  .connect('mongodb://localhost:27017/aroundb')
  .then(async () => {
    console.warn('Conectado a la base de datos aroundb');
    await ensureDemoUser();
  })
  .catch((err) => console.error('Error al conectar a MongoDB', err));

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6ab071665e3bffbe52a9bee7', // ID de usuario simulado
  };

  next();
});

app.use(router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.warn(`Servidor ejecutándose en el puerto ${PORT}`);
});