import React, { useState } from "react";
import "../styles/global.css";

function ActivityControl() {
  const [activities, setActivities] = useState([
    { id: 1, task: "Diseñar landing page", assignedTo: "Ana", status: "En progreso" },
    { id: 2, task: "Campaña redes sociales", assignedTo: "Carlos", status: "Pendiente" },
    { id: 3, task: "Revisión de código", assignedTo: "Luis", status: "Completada" },
  ]);

  // Cambiar estado de una actividad
  const updateStatus = (id, newStatus) => {
    setActivities((prev) =>
      prev.map((act) =>
        act.id === id ? { ...act, status: newStatus } : act
      )
    );
  };

  return (
    <div className="activities-page">
      <h2>Control de Actividades</h2>
      <div className="activity-grid">
        {activities.map((act) => (
          <div key={act.id} className={`activity-card ${act.status.toLowerCase()}`}>
            <h3>{act.task}</h3>
            <p><strong>Asignado a:</strong> {act.assignedTo}</p>
            <p><strong>Estado:</strong> {act.status}</p>
            <div className="activity-actions">
              <button onClick={() => updateStatus(act.id, "Pendiente")}>Pendiente</button>
              <button onClick={() => updateStatus(act.id, "En progreso")}>En progreso</button>
              <button onClick={() => updateStatus(act.id, "Completada")}>Completada</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ActivityControl;
