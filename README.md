# PA3 - Gestión de Tareas Personales

Aplicación web Full-Stack para registrar, consultar y eliminar tareas personales. Cada usuario ve solamente sus propias tareas.

Repositorio: [https://github.com/henoli2-gif/PA3-desarrolloweb.git](https://github.com/henoli2-gif/PA3-desarrolloweb.git)

## Descripción general y objetivo

El objetivo de este producto académico es construir un CRUD sencillo de tareas, separado en frontend y backend.

El usuario puede crear una cuenta, iniciar sesión y administrar su lista de tareas. La contraseña se guarda encriptada y el acceso a las tareas se protege con un token JWT. Los datos se almacenan en MongoDB Atlas.

## Tecnologías utilizadas

- **React** y **TypeScript** con **Vite**, para la interfaz.
- **Node.js** y **Express**, para la API.
- **MongoDB** y **Mongoose**, para guardar usuarios y tareas.

En el frontend se usan `useState`, `useEffect` y `fetch`. El diseño está hecho con CSS puro.

## Requisitos previos

Antes de instalar el proyecto necesitas:

1. [Node.js](https://nodejs.org/) (versión 18 o superior) y npm.
2. Una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas).
3. [Git](https://git-scm.com/), si vas a clonar el repositorio.

## Estructura del proyecto

```text
PA3/
├── client/                 Frontend (Vite + React + TypeScript)
│   ├── public/
│   └── src/
├── server/                 Backend (Node.js + Express)
│   └── src/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       └── routes/
├── README.md
└── .gitignore
```

## Instalación

Abre una terminal en la raíz del proyecto e instala cada parte por separado.

Backend:

```bash
cd server
npm install
```

Frontend (en otra terminal, desde la raíz):

```bash
cd client
npm install
```

## Variables de entorno

Dentro de `server` está el archivo `.env.example`. Tiene valores de ejemplo y **no lleva secretos reales**:

```env
PORT=4000
MONGO_URI=mongodb+srv://usuario:password@cluster0.mongodb.net/pa3_tareas_db
JWT_SECRET=clave_secreta_ejemplo
```

Para usar la API, copia ese archivo y renómbralo a `.env`:

```bash
cd server
copy .env.example .env
```

En macOS o Linux el comando es `cp .env.example .env`.

Luego edita `.env` y reemplaza los valores de ejemplo por los tuyos:

| Variable | Para qué sirve |
| --- | --- |
| `PORT` | Puerto del backend. En este proyecto es `4000`. |
| `MONGO_URI` | Cadena de conexión de MongoDB Atlas, con la base `pa3_tareas_db`. |
| `JWT_SECRET` | Clave privada con la que se firman los tokens. Usa un texto largo y no lo compartas. |

El archivo `.env` está en `.gitignore` (en la raíz, en `server` y en `client`) para que `node_modules` y los secretos no se suban al repositorio público.

## Conexión a MongoDB Atlas

1. Entra a [MongoDB Atlas](https://www.mongodb.com/atlas) y crea una cuenta gratuita.
2. Crea un clúster gratis (M0).
3. En **Database Access**, crea un usuario y guarda su contraseña.
4. En **Network Access**, agrega tu IP. Para probar en clase puedes permitir `0.0.0.0/0`.
5. En **Connect** > **Drivers**, copia la cadena de conexión.
6. Pégala en `MONGO_URI` dentro de `server/.env`.
7. Cambia `<db_password>` por la contraseña real del usuario de la base de datos.
8. Comprueba que el nombre de la base, al final de la ruta, sea `pa3_tareas_db`.

Mongoose crea la base y las colecciones cuando se guarda el primer usuario o la primera tarea. No hace falta crearlas a mano.

## Ejecución en desarrollo

Usa dos terminales al mismo tiempo.

Backend:

```bash
cd server
npm run dev
```

El API queda en `http://localhost:4000`.

Frontend:

```bash
cd client
npm run dev
```

La aplicación se abre en `http://localhost:5173`.

## Funcionalidades principales

### Registro con bcryptjs

`POST /api/auth/register`

Recibe `nombre`, `email` y `password`. Si falta algún campo, responde **400**. Si el correo ya existe, responde **400**. Si todo está bien, encripta la contraseña con bcryptjs, guarda el usuario y responde **201**.

### Login con JWT

`POST /api/auth/login`

Compara el correo y la contraseña con bcryptjs. Si las credenciales no coinciden, responde **401**. Si son correctas, responde **200** con un token JWT y el nombre del usuario. El frontend guarda el token en `localStorage`.

### Tareas por usuario

Estas rutas exigen el encabezado `Authorization: Bearer <token>`. Si el token falta o no es válido, el middleware responde **401**.

| Método | Ruta | Qué hace | Código |
| --- | --- | --- | --- |
| GET | `/api/tasks` | Lista solo las tareas del usuario autenticado | 200 |
| POST | `/api/tasks` | Crea una tarea con título y descripción | 201 |
| DELETE | `/api/tasks/:id` | Elimina una tarea si pertenece a ese usuario | 200 |

Si el título o la descripción llegan vacíos, o si la tarea no existe o es de otro usuario, la API responde **400**. Un fallo interno responde **500**.

En la pantalla principal se puede cerrar sesión, crear una tarea y eliminarla. La lista se actualiza en el momento, sin recargar la página.
