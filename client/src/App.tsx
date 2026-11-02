import { useState } from 'react';
import Auth from './components/Auth';
import TaskList from './components/TaskList';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [nombre, setNombre] = useState(localStorage.getItem('nombre') || '');

  function handleLogin(nuevoToken: string, nuevoNombre: string) {
    // La sesión queda guardada aunque se recargue la página
    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('nombre', nuevoNombre);
    setToken(nuevoToken);
    setNombre(nuevoNombre);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    setToken(null);
    setNombre('');
  }

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return <TaskList token={token} nombre={nombre} onLogout={handleLogout} />;
}

export default App;
