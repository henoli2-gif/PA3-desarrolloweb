import { useEffect, useState, type FormEvent } from 'react';
import type { Task } from '../types';

const API_URL = 'http://localhost:4000';

interface TaskListProps {
  token: string;
  nombre: string;
  onLogout: () => void;
}

function TaskList({ token, nombre, onLogout }: TaskListProps) {
  const [tareas, setTareas] = useState<Task[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorLista, setErrorLista] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  // Al abrir la vista, pedimos solo las tareas de este usuario
  useEffect(() => {
    async function cargarTareas() {
      try {
        const respuesta = await fetch(`${API_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
          setErrorLista(data.mensaje || 'No se pudieron cargar las tareas.');
          return;
        }

        setTareas(data);
      } catch {
        setErrorLista('No se pudo conectar con el servidor.');
      } finally {
        setCargando(false);
      }
    }

    cargarTareas();
  }, [token]);

  async function crearTarea(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensaje('');

    if (titulo.trim() === '' || descripcion.trim() === '') {
      setMensaje('Escribe un título y una descripción.');
      return;
    }

    setGuardando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          descripcion: descripcion.trim()
        })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(data.mensaje || 'No se pudo crear la tarea.');
        return;
      }

      // La nueva tarea aparece al instante, sin recargar la página
      setTareas([data, ...tareas]);
      setTitulo('');
      setDescripcion('');
    } catch {
      setMensaje('No se pudo conectar con el servidor.');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarTarea(id: string) {
    setMensaje('');
    setEliminandoId(id);

    try {
      const respuesta = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(data.mensaje || 'No se pudo eliminar la tarea.');
        return;
      }

      setTareas(tareas.filter((tarea) => tarea._id !== id));
    } catch {
      setMensaje('No se pudo conectar con el servidor.');
    } finally {
      setEliminandoId(null);
    }
  }

  return (
    <main className="pagina">
      <header className="encabezado">
        <div>
          <h1>Mis tareas</h1>
          <p className="ayuda">Hola, {nombre || 'usuario'}.</p>
        </div>
        <button type="button" className="secundario" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      <section className="tarjeta">
        <h2>Nueva tarea</h2>
        <form onSubmit={crearTarea} noValidate>
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
          />

          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            rows={3}
            value={descripcion}
            onChange={(evento) => setDescripcion(evento.target.value)}
          />

          {mensaje && (
            <p className="mensaje" role="alert">
              {mensaje}
            </p>
          )}

          <button type="submit" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Crear tarea'}
          </button>
        </form>
      </section>

      <section className="lista">
        {cargando && <p className="ayuda">Cargando tareas...</p>}
        {errorLista && <p className="mensaje">{errorLista}</p>}

        {!cargando && !errorLista && tareas.length === 0 && (
          <p className="ayuda">Aún no tienes tareas. Crea la primera.</p>
        )}

        {tareas.map((tarea) => (
          <article key={tarea._id} className="tarea">
            <div>
              <h3>{tarea.titulo}</h3>
              <p>{tarea.descripcion}</p>
            </div>
            <button
              type="button"
              className="peligro"
              onClick={() => eliminarTarea(tarea._id)}
              disabled={eliminandoId === tarea._id}
            >
              {eliminandoId === tarea._id ? 'Eliminando...' : 'Eliminar'}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default TaskList;
