import { rateLimit } from 'express-rate-limit';

// Inicio de sesión: una persona lo hace seguido, un bot que prueba contraseñas lo hace miles de veces
export const signinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ventana de 15 minutos
  limit: 10, // máximo 10 peticiones por ventana
  message: {
    message: 'Demasiados intentos de inicio de sesión. Inténtalo de nuevo más tarde.',
  },
});

// Registro: una persona lo hace una vez, un bot que crea cuentas falsas lo hace en serie
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ventana de 1 hora
  limit: 20, // máximo 20 peticiones por ventana
  message: {
    message: 'Demasiados registros desde esta dirección. Inténtalo de nuevo más tarde.',
  },
});
