# TaskManagerBackEnd
## Descripción
Este repositorio contiene el **backend** de la aplicación web de gestión de tareas y subtareas denominada **Coordinate**. El objetivo es proporcionar una API robusta y una capa de sincronización en tiempo real para un sistema colaborativo de gestión de tareas.

El sistema implementa operaciones **CRUD** completas para tareas (incluyendo la lógica de subtareas de un solo nivel), validaciones de estado complejas (como no permitir completar una tarea padre si sus subtareas no están completadas) y utiliza **Socket.IO** para la comunicación en tiempo real entre clientes.

## Stack
* **Backend:** Node.js + Express
* **Base de datos:** PostgreSQL
* **ORM:** TypeORM
* **Realtime:** Socket.IO
* **Lenguaje:** TypeScript
* **Autenticación:** JWT (Opcional, estructura preparada si se requiere)
* **Frontend (referencia):** Next.js 14 + React.js + @mui/material

## Cómo correr localmente
Para ejecutar el proyecto en tu máquina, sigue los siguientes pasos. Este proceso asume que ya tienes **Node.js** (v18+) y **PostgreSQL** instalados y configurados.

1.  **Clonar el repositorio: Backend**
    ```bash
    git clone [https://github.com/EduardDevelop/TaskManagerBackEnd.git](https://github.com/EduardDevelop/TaskManagerBackEnd.git)
    cd TaskManagerBackEnd
    ```
    **Clonar el repositorio: FrontEnd**
    ```bash
    git clone [https://github.com/EduardDevelop/TaskManagerFrontEnd.git](https://github.com/EduardDevelop/TaskManagerFrontEnd.git)
    cd TaskManagerBackFrontEnd
    ```

2.  **Instalar dependencias:**
    Ejecuta el comando para instalar todas las dependencias listadas en el `package.json`:
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env` en la raíz del proyecto y define las variables de entorno para la conexión a PostgreSQL y el puerto de la API:
    ```
    # Configuración de la base de datos PostgreSQL
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=tu_usuario_pg
    DB_PASSWORD=tu_contraseña_pg
    DB_DATABASE=taskmanager_db

    # Puerto de la API
    PORT=3000
    ```

4.  **Crear la base de datos:**
  Gracias a la usabilidad de TypeORM, solo es requerida la ejecucion de npm run dev, para la creacion automatica de las tablas, (Asegurate de el nombre de la base de datos de postgres concuerde con la de las variables de entorno)

5.  **Ejecutar el servidor:**
    Ejecuta la aplicación en modo desarrollo. Este comando asume el uso de `nodemon` y `ts-node` para recompilar automáticamente:
    ```bash
    npm run dev
    ```

El servidor de la API estará disponible en `http://localhost:3000` y el servidor de Socket.IO estará escuchando para conexiones en tiempo real.

## Endpoints principales (BACK)
La API se expone bajo el prefijo `/api`.

 `http://localhost:3000/api/tasks?include=subtasks&status=TO_DO` 
  `http://localhost:3000/api/tasks/6` 
   `http://localhost:3000/api/tasks` |
`http://localhost:3000/api/tasks/6` |
 `http://localhost:3000/api/tasks/6` |
`http://localhost:3000/api/users` |

## Decisiones técnicas

### ORM elegido: TypeORM
Se eligió **TypeORM** como Object-Relational Mapper (ORM) por las siguientes razones:

1.  **Integración con TypeScript:** TypeORM está diseñado para trabajar con TypeScript, utilizando decoradores para definir entidades. Esto proporciona un **tipado fuerte** para los modelos de datos, reduciendo errores y mejorando la calidad del código.
2.  **Soporte a patrones flexibles:** Soporta los patrones **Active Record** y **Data Mapper**. El uso del *Repository* (Data Mapper) facilita la separación de la lógica de negocio y la de persistencia, haciendo el código más limpio y testeable.
3.  **Manejo de relaciones:** Simplifica la implementación de la relación recursiva "padre-hijo" (tarea-subtarea) y maneja las complejas consultas necesarias para listar tareas con sus subtareas anidadas.

### Librería de Tablas (Frontend): @mui/x-data-grid (asumiendo su uso en el frontend)

Dado que el frontend utiliza **Material UI (`@mui/material`)**, se justifican las librerías de tablas más comunes en este ecosistema:


 **Enfoque**  Solución "todo en uno" (UI y Lógica incluida) -- "Headless UI" (Solo lógica, sin estilo) --
 **Integración UI**  Perfecta, nativa con el diseño de Material UI. -- Requiere aplicar estilos personalizados (ej. con MUI o Tailwind). 
 **Funcionalidades** Soporte nativo y optimizado para **árbol de datos (Data Tree)**, paginación, filtros. --Ofrece la lógica. El desarrollador debe implementar la interfaz de las funcionalidades. --
 **Requisito Clave**  Simplifica la implementación del requisito de la **tabla anidada expandible**. --Mayor complejidad para construir la interfaz anidada y la virtualización. 

**Justificación de la elección de MUI DataGrid (o similar de MUI):**
La elección se basa en la **coherencia del ecosistema** y la **funcionalidad de la tabla anidada**. Al usar MUI en el frontend, `MUI DataGrid` garantiza una consistencia visual sin esfuerzo y ofrece funcionalidad clave como el soporte para **Data Tree** y **virtualización** de forma inmediata. Esto minimiza el tiempo de desarrollo en la interfaz y permite centrarse en la lógica de negocio y el tiempo real.

### Decisión sobre `DELETE /api/tasks/:id`

Se ha implementado una política de **Bloqueo de Eliminación** (Preventive Block) si una tarea tiene subtareas asociadas.

* **Razón:** Para mantener la **integridad de los datos** y la coherencia del sistema de progreso. Si se permitiera una *eliminación en cascada* (`Cascade Delete`), se podrían perder subtareas accidentalmente, lo cual es perjudicial para la colaboración.
* **Comportamiento:** Si un usuario intenta eliminar una tarea padre que contiene subtareas, el endpoint responde con un código **400 Bad Request** (o 409 Conflict), obligando al usuario a eliminar o reasignar las subtareas primero.

# TaskManagerFrontEnd
