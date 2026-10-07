# Around The U.S.

Aplicación web full-stack que combina un front end en React con una API propia en Express. Permite a un usuario registrarse, iniciar sesión y gestionar su perfil y una galería de tarjetas de lugares de los EE. UU.

## Descripción y funcionalidad

El proyecto está dividido en dos mitades que viven en un mismo repositorio:

- **`client/`** — aplicación de React + TypeScript (Vite) que consume la API propia.
- **`server/`** — API REST construida con Express + TypeScript y MongoDB.

Funcionalidad principal:

- **Registro e inicio de sesión** de usuarios contra la API de autenticación, con persistencia de sesión mediante un token JWT guardado en `localStorage`.
- **Rutas protegidas**: el contenido principal (`/`) solo es accesible para usuarios autenticados; los visitantes son redirigidos a `/signin`. Un usuario ya autenticado que intenta visitar `/signin` o `/signup` es redirigido a `/`.
- **Perfil de usuario**: ver y editar nombre, descripción y avatar.
- **Galería de tarjetas**: agregar nuevas tarjetas, dar/quitar "me gusta" y eliminar tarjetas propias.
- **Retroalimentación visual** (InfoTooltip) sobre el resultado del registro y el inicio de sesión.
- **Cierre de sesión**, que limpia el token y regresa la aplicación al estado de visitante.

## Tecnologías y técnicas utilizadas

- **React 18** + **TypeScript** + **Vite**
- **React Router** para el enrutamiento y la protección de rutas
- **Context API** (`CurrentUserContext`) para compartir los datos del usuario entre componentes
- **Express** + **TypeScript** para la API REST propia
- **MongoDB** / Mongoose como base de datos
- **CORS** configurado entre el front end (`http://localhost:3000`) y la API propia (`http://localhost:3001`)
- API de autenticación externa de TripleTen para registro, inicio de sesión y verificación de token
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

**Pendiente para el siguiente sprint (fuera de alcance actual)**

El endpoint `deleteCard` del servidor no verifica que la tarjeta pertenezca al usuario que hace la petición: cualquier usuario autenticado podría eliminar tarjetas ajenas. Hoy esto no tiene impacto práctico porque el middleware temporal asigna el mismo `req.user._id` a todas las peticiones (aún no hay usuarios reales en la API propia), pero es un control de acceso (IDOR) que debe añadirse cuando se implemente autenticación real en el backend.

## Cómo ejecutar el proyecto

```bash
npm run install:all
```

Levanta cada mitad en su propia terminal (MongoDB debe estar corriendo antes de iniciar el servidor):

```bash
npm run dev:server   # API en http://localhost:3001
npm run dev:client   # Aplicación en http://localhost:3000
```
