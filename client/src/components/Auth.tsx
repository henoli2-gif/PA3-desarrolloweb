import { useState, type FormEvent } from 'react';
import type { User } from '../types';

const API_URL = 'http://localhost:4000';

interface AuthProps {
  onLogin: (token: string, nombre: string) => void;
}

function Auth({ onLogin }: AuthProps) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [esExito, setEsExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  function cambiarModo() {
    setEsRegistro(!esRegistro);
    setMensaje('');
    setEsExito(false);
  }

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensaje('');
    setEsExito(false);

    const faltaNombre = esRegistro && nombre.trim() === '';

    if (faltaNombre || email.trim() === '' || password.trim() === '') {
      setMensaje('Completa todos los campos.');
      return;
    }

    setCargando(true);

    try {
      if (esRegistro) {
        const nuevoUsuario: User = {
          nombre: nombre.trim(),
          email: email.trim()
        };

        const respuesta = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nuevoUsuario, password })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
          setMensaje(data.mensaje || 'No se pudo registrar el usuario.');
          return;
        }

        setEsExito(true);
        setMensaje('Registro exitoso. Ahora inicia sesión.');
        setEsRegistro(false);
        setPassword('');
        return;
      }

      const respuesta = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(data.mensaje || 'No se pudo iniciar sesión.');
        return;
      }

      onLogin(data.token, data.nombre);
    } catch {
      setMensaje('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="pagina">
      <section className="tarjeta">
        <h1>Gestión de Tareas</h1>
        <p className="ayuda">
          {esRegistro
            ? 'Crea tu cuenta para guardar tus tareas.'
            : 'Inicia sesión para ver tus tareas.'}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {esRegistro && (
            <>
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
              />
            </>
          )}

          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
          />

          {mensaje && (
            <p className={esExito ? 'mensaje ok' : 'mensaje'} role="alert">
              {mensaje}
            </p>
          )}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Espera...' : esRegistro ? 'Registrarme' : 'Iniciar sesión'}
          </button>
        </form>

        <button type="button" className="enlace" onClick={cambiarModo}>
          {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </section>
    </main>
  );
}

export default Auth;
