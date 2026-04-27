import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import "../styles/global.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

function Statistics() {
  // Datos simulados
  const tasks = [
    { id: 1, text: "Tarea 1", completed: true },
    { id: 2, text: "Tarea 2", completed: false },
    { id: 3, text: "Tarea 3", completed: true },
    { id: 4, text: "Tarea 4", completed: false },
  ];

  const notes = [
    { id: 1, title: "Nota 1", content: "Contenido de la nota" },
    { id: 2, title: "Nota 2", content: "Otra nota" },
  ];

  const reminders = [
    { id: 1, text: "Reunión mañana a las 9 AM" },
    { id: 2, text: "Enviar reporte semanal" },
    { id: 3, text: "Comprar café" },
  ];

  // Estadísticas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Datos para gráfica circular (tareas)
  const doughnutData = {
    labels: ["Completadas", "Pendientes"],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ["#005B97", "#F7DC4F"], // azul primario y amarillo
      },
    ],
  };

  // Datos para gráfica de barras (notas y recordatorios)
  const barData = {
    labels: ["Notas", "Recordatorios"],
    datasets: [
      {
        label: "Cantidad",
        data: [notes.length, reminders.length],
        backgroundColor: ["#79A8E8", "#009E49"], // azul claro y verde
      },
    ],
  };

  // Datos para gráfica de línea (evolución de tareas completadas en una semana)
  const lineData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Tareas completadas",
        data: [1, 2, 2, 3, 3, 4, 4], // simulación de progreso
        borderColor: "#005B97", // azul primario
        backgroundColor: "rgba(0, 91, 151, 0.3)", // azul primario translúcido
        fill: true,
      },
    ],
  };

  return (
    <div className="statistics-page">
      <h2>Estadísticas de Productividad</h2>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ color: "#005B97" }}>
          Tareas completadas: {completedTasks}
        </div>
        <div className="kpi-card" style={{ color: "#79A8E8" }}>
          Notas creadas: {notes.length}
        </div>
        <div className="kpi-card" style={{ color: "#009E49" }}>
          Recordatorios activos: {reminders.length}
        </div>
      </div>

      {/* Gráficas */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Tareas</h3>
          <Doughnut data={doughnutData} />
        </div>

        <div className="stat-card">
          <h3>Notas vs Recordatorios</h3>
          <Bar data={barData} />
        </div>

        <div className="stat-card">
          <h3>Evolución semanal</h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}

export default Statistics;
