import React, { useState } from "react";
import "../styles/global.css";

function Goals() {
  // Datos simulados de metas
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: "Completar 20 tareas este mes",
      target: 20,
      progress: 12,
      deadline: "2026-04-30",
    },
    {
      id: 2,
      title: "Crear 5 notas de estudio",
      target: 5,
      progress: 2,
      deadline: "2026-04-20",
    },
    {
      id: 3,
      title: "Mantener 3 recordatorios activos",
      target: 3,
      progress: 3,
      deadline: "2026-04-15",
    },
  ]);

  return (
    <div className="goals-page">
      <h2>Mis Metas</h2>

      {/* Formulario simulado */}
      <form className="goal-form">
        <input type="text" placeholder="Nombre de la meta..." />
        <input type="number" placeholder="Cantidad objetivo..." />
        <input type="date" />
        <button type="button">Agregar</button>
      </form>

      {/* Lista de metas */}
      <div className="goals-list">
        {goals.map((goal) => {
          const percentage = Math.min(
            Math.round((goal.progress / goal.target) * 100),
            100
          );
          return (
            <div key={goal.id} className="goal-card">
              <h3>{goal.title}</h3>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p>
                Progreso: {goal.progress}/{goal.target} ({percentage}%)
              </p>
              <p>Fecha límite: {goal.deadline}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Goals;
