# Around The U.S.

Aplicación web full-stack que combina un front end en React con una API propia en Express. Permite a un usuario registrarse, iniciar sesión y gestionar su perfil y una galería de tarjetas de lugares de los EE. UU.

## Despliegue

- **Front end:** https://web-project-around-full-tdjl.vercel.app
- **API:** https://web-project-around-full-seven.vercel.app

## Descripción y funcionalidad

El proyecto está dividido en dos mitades que viven en un mismo repositorio:

- **`client/`** — aplicación de React + TypeScript (Vite) que consume la API propia.
- **`server/`** — API REST construida con Express + TypeScript y MongoDB.

Funcionalidad principal:

- **Registro e inicio de sesión** contra la API propia (`POST /signup` y `POST /signin`): contraseñas hasheadas con bcrypt y tokens JWT firmados por el servidor, que el cliente guarda en `localStorage`.
- **Rutas protegidas**: el contenido principal (`/`) solo es accesible para usuarios autenticados; los visitantes son redirigidos a `/signin`. Un usuario ya autenticado que intenta visitar `/signin` o `/signup` es redirigido a `/`.
- **Perfil de usuario**: ver y editar nombre, descripción y avatar.
- **Galería de tarjetas**: cada tarjeta tiene dueño. Cada persona ve solo sus tarjetas y solo ella puede borrarlas o cambiar sus "me gusta" (el servidor responde 403 si no es suya).
- **Retroalimentación visual** (InfoTooltip) sobre el resultado del registro y el inicio de sesión.
- **Cierre de sesión**, que limpia el token y regresa la aplicación al estado de visitante.

## Tecnologías y técnicas utilizadas

- **React 18** + **TypeScript** + **Vite**
- **React Router** para el enrutamiento y la protección de rutas
- **Context API** (`CurrentUserContext`) para compartir los datos del usuario entre componentes
- **Express** + **TypeScript** para la API REST propia
- **MongoDB** / Mongoose como base de datos
- **CORS** configurado entre el front end (`http://localhost:3000`) y la API propia (`http://localhost:3001`)
- **bcryptjs** y **jsonwebtoken** para la autenticación propia
- **express-rate-limit** en `/signin` y `/signup`
- **dotenv** para la configuración del servidor y variables `VITE_` para el cliente
- Despliegue en **Vercel** (dos proyectos: `server` y `client`) con **MongoDB Atlas**
- Metodología **BEM** para las hojas de estilo

## Consideraciones de seguridad

Análisis realizado sobre el propio código a partir de la lección de seguridad del sprint:

**Protecciones ya presentes**

- **XSS en contenido generado por el usuario**: React escapa automáticamente todo el texto renderizado (`{currentUser?.name}`, `{card.name}`, etc.). No se usa `dangerouslySetInnerHTML` en ningún componente, por lo que no hay inyección de HTML o scripts por esa vía.
- **XSS vía URLs de imagen** (`avatar`, `link` de tarjeta): el servidor valida ambas URLs con una expresión regular que exige el esquema `http://` o `https://`, bloqueando URLs tipo `javascript:...` que podrían ejecutarse al interactuar con la imagen.
- **El manejador de errores no filtra información sensible**: ante un error 500 responde con un mensaje genérico ("Ha ocurrido un error en el servidor") en lugar de exponer el stack trace o detalles internos.
- **Dependencias**: se corrigió una vulnerabilidad crítica de IP spoofing en `proxy-addr` (dependencia transitiva de Express) mediante `npm audit fix`. Ambas mitades del proyecto están actualmente en 0 vulnerabilidades conocidas.

**Dónde se guarda el token, y el trade-off que implica**

El token JWT se guarda en `localStorage`, tal como pide este sprint. Es simple y funciona bien, pero tiene un riesgo conocido: si en el futuro se introdujera una vulnerabilidad XSS (por ejemplo, a través de una dependencia de terceros comprometida), un script malicioso podría leer `localStorage` y robar el token — algo que no sería posible si el token viviera en una cookie `httpOnly`. Hoy no hay ningún vector de XSS abierto en el código, así que el riesgo es bajo, pero es justamente el motivo por el que el siguiente sprint se enfoca en proteger la aplicación desde el servidor (típicamente migrando a cookies `httpOnly` + protección CSRF).

**Resuelto en el sprint 16**

- El middleware temporal con un `_id` fijo se eliminó: `req.user` lo llena un middleware que verifica el JWT y responde 401 si falta, está mal formado o expiró.
- `deleteCard`, `likeCard` y `dislikeCard` comprueban primero que la tarjeta exista (404) y después que sea de quien la pide (403), cerrando el IDOR que quedó pendiente.
- Ninguna respuesta incluye el hash de la contraseña, y el correo solo lo ve su dueño.
- Los secretos y la configuración viven en variables de entorno (`server/.env.example` y `client/.env.example` muestran las claves necesarias).

## Cómo ejecutar el proyecto

```bash
npm run install:all
```

Crea `server/.env` a partir de `server/.env.example` (con un `JWT_SECRET` generado con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"`) y `client/.env` a partir de `client/.env.example`.

Levanta cada mitad en su propia terminal (MongoDB debe estar corriendo antes de iniciar el servidor):

```bash
npm run dev:server   # API en http://localhost:3001
npm run dev:client   # Aplicación en http://localhost:3000
```
