# Tripleten web_project_around_express

# Back End "Alrededor de los EE.UU." — API REST con Node.js y Express

Este proyecto constituye la infraestructura del lado del servidor (back-end) para la aplicación "Alrededor de los EE.UU.". El objetivo principal de este desarrollo es crear una API REST sólida y eficiente que centralice, procese y distribuya los datos de la plataforma, sirviendo como la base para la futura implementación de autenticación de usuarios y persistencia en bases de datos.

## Funcionalidad de la API

La aplicación expone un conjunto de rutas estructuradas que devuelven respuestas en formato JSON, manejando de forma segura las peticiones del cliente y gestionando posibles excepciones en el servidor:

- **GET `/users`**: Devuelve una lista completa con todos los usuarios registrados.
- **GET `/cards`**: Devuelve el listado íntegro de las tarjetas de lugares publicadas.
- **GET `/users/:id`**: Busca y devuelve los datos de un usuario específico basado en su identificador único (`_id`). Si el identificador no existe en el sistema, responde con un código de estado `404` y el mensaje `"ID de usuario no encontrado"`.
- **Manejo de rutas inexistentes**: Cualquier solicitud a un endpoint no definido o erróneo es interceptada globalmente, respondiendo con un código de estado `404` y el mensaje `"Recurso solicitado no encontrado"`.
- **Control de excepciones (Error 500)**: Toda la gestión de lectura de archivos está protegida ante fallos inesperados, respondiendo con un código de estado `500` y el mensaje `"Ha ocurrido un error en el servidor"` para evitar caídas del proceso.

## Tecnologías y Técnicas Utilizadas

Para garantizar un código limpio, modular y con rendimiento de producción, se implementaron las siguientes herramientas y patrones de diseño:

- **Node.js & Express**: Arquitectura base para la gestión del servidor HTTP y enrutamiento dinámico.
- **TypeScript 7**: Incorporación de tipado estricto para la prevención de errores en tiempo de desarrollo.
- **Módulos ES (import/export)**: Uso de la sintaxis moderna de JavaScript para la organización y carga de dependencias.
- **Separación de Responsabilidades**: El código está modularizado siguiendo el patrón de diseño **Controllers y Routers**, aislando la lógica de negocio del enrutamiento de URLs.
- **Lectura Asíncrona de Archivos (`node:fs/promises`)**: Consumo de datos de manera no bloqueante utilizando promesas nativas de Node.js para maximizar la concurrencia del servidor.
- **Rutas Absolutas Seguras (`node:path` & `import.meta.dirname`)**: Construcción de rutas del sistema de archivos de forma segura y multiplataforma.
- **Calidad de Código (ESLint & Prettier)**: Integración de un linter estático automatizado con excepciones personalizadas (como el soporte de guiones bajos para el `_id` de MongoDB) y formateo automático de estilo.

## Cómo Ejecutar el Proyecto

1. Instala las dependencias del proyecto:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Inicia el servidor en modo de desarrollo con Hot Reload (puerto 3000):
   ```bash
   npm run dev
   ```
3. Ejecuta el control de calidad del código (Linter):
   ```bash
   npm run lint
   ```
4. Compila el proyecto TypeScript a JavaScript nativo:
   ```bash
   npm run build
   ```
