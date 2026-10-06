import { Router } from 'express';
import { usersRouter } from './users.js';
import { cardsRouter } from './cards.js';

const router = Router();

// Montamos los submódulos de la API con sus prefijos oficiales
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

// Captura global de rutas no existentes (Requisito de la rúbrica)
router.use((req, res) => {
  res.status(404).json({ message: 'Recurso solicitado no encontrado' });
});

export default router;
