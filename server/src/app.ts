import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();
const PORT = 3001;

mongoose
  .connect('mongodb://localhost:27017/aroundb')
  .then(() => console.warn('Conectado a la base de datos aroundb'))
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