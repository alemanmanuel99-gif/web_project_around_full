# Alrededor de los EE.UU. — Migración a React

Este proyecto es la migración de la aplicación web "Alrededor de los EE.UU." de HTML/CSS/JavaScript puro a **React** con **TypeScript**, usando **Vite** como herramienta de construcción.

## Descripción

La aplicación muestra el perfil de un usuario y una galería de tarjetas con imágenes de distintos lugares de EE.UU. conectada a una API real. Permite:

- Ver el perfil del usuario (nombre, descripción y avatar) cargado desde el servidor.
- Editar el nombre y descripción del perfil.
- Actualizar la foto de perfil.
- Agregar nuevas tarjetas con nombre e imagen.
- Ver la imagen de una tarjeta en tamaño completo.
- Dar y quitar "me gusta" a las tarjetas.
- Eliminar tarjetas propias con confirmación.

## Tecnologías utilizadas

- React 18
- TypeScript
- Vite
- CSS (BEM)
- React Context API para gestión de estado global
- API REST (fetch) para comunicación con el servidor

## Estructura del proyecto

El código está organizado en componentes reutilizables dentro de `src/components`. Los tipos están definidos en `src/interfaces/`. La comunicación con la API está centralizada en `src/utils/api.ts`. El estado global del usuario se comparte mediante `CurrentUserContext` definido en `src/contexts/`.

## Cómo ejecutar el proyecto

1. Clona el repositorio.
2. Instala las dependencias:

```bash
npm i
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

4. El proyecto se abrirá en `http://localhost:3000`.
