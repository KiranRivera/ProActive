import React, { useState, useEffect } from "react";
import axios from "axios"; // 1. Importamos Axios
import "../styles/global.css";

// Configuración base de la API
const API_URL = "http://localhost:3001/api/tasks";
const USER_ID = "ROElvXHkgSOHUnMDMfKf"; // Tu ID de usuario de Firebase

function TaskList() {
  const [tasks, setTasks] = useState([]); // Iniciamos con lista vacía
  const [newTask, setNewTask] = useState("");

  // 2. Cargar tareas al iniciar el componente
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/${USER_ID}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error al cargar tareas:", error);
    }
  };

  // 3. Agregar tarea al Backend (POST)
  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;

    try {
      await axios.post(`${API_URL}/${USER_ID}`, {
        titulo: newTask // Debe coincidir con lo que espera tu controlador
      });
      setNewTask("");
      fetchTasks(); // Recargamos de la DB para tener el ID real generado por Firebase
    } catch (error) {
      console.error("Error al agregar tarea:", error);
    }
  };

  // 4. Alternar estado (PATCH)
  const toggleTask = async (task) => {
    try {
      await axios.patch(`${API_URL}/${USER_ID}/${task.id}`, {
        completada: !task.completada
      });
      fetchTasks();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  // 5. Eliminar tarea del Backend (DELETE)
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${USER_ID}/${id}`);
      // Optimización: Actualizamos el estado local sin esperar al servidor
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  // Filtramos usando "titulo" y "completada" según los nombres de tu Firestore
  const pendingTasks = tasks.filter((task) => !task.completada);
  const completedTasks = tasks.filter((task) => task.completada);

  return (
    <div className="task-page">
      <h2>Mis Tareas</h2>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Nueva tarea..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      {/* Pendientes */}
      <section>
        <h3>Pendientes</h3>
        <div className="task-list">
          {pendingTasks.map((task) => (
            <div key={task.id} className="task-item">
              <span onClick={() => toggleTask(task)}>{task.titulo}</span>
              <button className="delete" onClick={() => deleteTask(task.id)}>X</button>
            </div>
          ))}
          {pendingTasks.length === 0 && <p>No hay tareas pendientes</p>}
        </div>
      </section>

      {/* Completadas */}
      <section>
        <h3>Completadas</h3>
        <div className="task-list">
          {completedTasks.map((task) => (
            <div key={task.id} className="task-item completed">
              <span onClick={() => toggleTask(task)}>
                {task.titulo} ✔
              </span>
              <button className="delete" onClick={() => deleteTask(task.id)}>X</button>
            </div>
          ))}
          {completedTasks.length === 0 && <p>No hay tareas completadas</p>}
        </div>
      </section>
    </div>
  );
}

export default TaskList;