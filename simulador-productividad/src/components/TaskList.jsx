import React, { useState } from "react";
import "../styles/global.css";

function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Estudiar matemáticas", completed: false },
    { id: 2, title: "Hacer ejercicio", completed: true },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    const newItem = {
      id: tasks.length + 1,
      title: newTask,
      completed: false,
    };
    setTasks([...tasks, newItem]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="task-page">
      <h2>Mis Tareas</h2>

      {/* Formulario arriba */}
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
              <span onClick={() => toggleTask(task.id)}>{task.title}</span>
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
              <span onClick={() => toggleTask(task.id)}>
                {task.title} ✔
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
