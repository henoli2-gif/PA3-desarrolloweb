// Datos del usuario que se registran en la aplicación
export interface User {
  nombre: string;
  email: string;
}

// Una tarea guardada en MongoDB
export interface Task {
  _id: string;
  titulo: string;
  descripcion: string;
  userId: string;
}
