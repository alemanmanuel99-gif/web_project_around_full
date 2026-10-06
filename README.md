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

## Cómo ejecutar el proyecto

```bash
npm run install:all
```

Levanta cada mitad en su propia terminal (MongoDB debe estar corriendo antes de iniciar el servidor):

```bash
npm run dev:server   # API en http://localhost:3001
npm run dev:client   # Aplicación en http://localhost:3000
```
