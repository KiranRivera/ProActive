import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

// 1. CONFIGURACIÓN DE LA URL DINÁMICA
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/tasks` 
  : "http://localhost:3001/api/tasks";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // RECUPERAMOS EL ID REAL DEL LOCALSTORAGE
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchTasks();
  }, [userId, navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Petición al backend (Local o Render)
      const response = await axios.get(`${API_URL}/${userId}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error al cargar tareas desde la nube:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === "" || !userId) return;

    try {
      await axios.post(`${API_URL}/${userId}`, {
        titulo: newTask.trim() 
      });
      setNewTask("");
      fetchTasks(); // Refrescamos la lista desde el servidor
    } catch (error) {
      console.error("Error al guardar tarea en la nube:", error);
    }
  };

  const toggleTask = async (task) => {
    try {
      await axios.patch(`${API_URL}/${userId}/${task.id}`, {
        completada: !task.completada
      });
      fetchTasks();
    } catch (error) {
      console.error("Error al actualizar estado en la nube:", error);
    }
  };

  const deleteTask = async (id) => {
    // Feedback visual inmediato antes de la petición
    const originalTasks = [...tasks];
    setTasks(tasks.filter((task) => task.id !== id));

    try {
      await axios.delete(`${API_URL}/${userId}/${id}`);
    } catch (error) {
      console.error("Error al eliminar en la nube:", error);
      setTasks(originalTasks); // Revertimos si falla
      alert("No se pudo eliminar la tarea.");
    }
  };

  const pendingTasks = tasks.filter((task) => !task.completada);
  const completedTasks = tasks.filter((task) => task.completada);

  if (loading && tasks.length === 0) return <div className="loading">Sincronizando tus tareas...</div>;

  return (
    <div className="task-page">
      <div className="header-flex">
        <h2>Mis Tareas</h2>
      </div>

      <form className="task-form shadow-sm" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Escribe algo que debas hacer..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          required
        />
        <button type="submit" className="btn-add">Agregar</button>
      </form>

      <section className="task-section">
        <h3>Pendientes ({pendingTasks.length})</h3>
        <div className="task-list">
          {pendingTasks.map((task) => (
            <div key={task.id} className="task-item card-animation">
              <div className="task-text" onClick={() => toggleTask(task)}>
                <div className="custom-checkbox"></div>
                <span>{task.titulo}</span>
              </div>
              <button className="delete-btn" onClick={() => deleteTask(task.id)} title="Eliminar">
                &times;
              </button>
            </div>
          ))}
          {!loading && pendingTasks.length === 0 && (
            <p className="empty-msg">¡Excelente! No tienes nada pendiente.</p>
          )}
        </div>
      </section>

      <section className="task-section">
        <h3>Completadas ({completedTasks.length})</h3>
        <div className="task-list">
          {completedTasks.map((task) => (
            <div key={task.id} className="task-item completed card-animation">
              <div className="task-text" onClick={() => toggleTask(task)}>
                <div className="custom-checkbox checked">✓</div>
                <span>{task.titulo}</span>
              </div>
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                &times;
              </button>
            </div>
          ))}
          {completedTasks.length === 0 && <p className="empty-msg">Aún no has terminado ninguna tarea hoy.</p>}
        </div>
      </section>
    </div>
  );
}

export default TaskList;