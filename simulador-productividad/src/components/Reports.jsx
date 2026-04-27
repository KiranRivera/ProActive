import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "../styles/global.css";

// Registro de componentes de Chart.js
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement
);

function Reports() {
  // Datos simulados de productividad por usuario
  const reportData = [
    { user: "Ana", tasks: 15, goals: 3, reminders: 2 },
    { user: "Luis", tasks: 20, goals: 4, reminders: 1 },
    { user: "Marta", tasks: 10, goals: 2, reminders: 3 },
  ];

  // Totales calculados
  const totalTasks = reportData.reduce((acc, r) => acc + r.tasks, 0);
  const totalGoals = reportData.reduce((acc, r) => acc + r.goals, 0);
  const totalReminders = reportData.reduce((acc, r) => acc + r.reminders, 0);

  // Configuración común para que las gráficas sean responsivas
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom', // Mejor para pantallas móviles
      }
    }
  };

  // Gráfica de barras
  const tasksBarData = {
    labels: reportData.map((r) => r.user),
    datasets: [
      {
        label: "Tareas completadas",
        data: reportData.map((r) => r.tasks),
        backgroundColor: "#005B97",
      },
    ],
  };

  // Gráfica donut
  const goalsRemindersData = {
    labels: ["Metas alcanzadas", "Recordatorios activos"],
    datasets: [
      {
        data: [totalGoals, totalReminders],
        backgroundColor: ["#F7DC4F", "#009E49"],
      },
    ],
  };

  return (
    <div className="reports-page">
      <h2>Reportes de Productividad</h2>

      {/* IMPORTANTE: El contenedor 'report-table-container' permite el scroll 
          horizontal definido en tu global.css 
      */}
      <div className="report-table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Tareas completadas</th>
              <th>Metas alcanzadas</th>
              <th>Recordatorios activos</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, i) => (
              <tr key={i}>
                <td>{row.user}</td>
                <td>{row.tasks}</td>
                <td>{row.goals}</td>
                <td>{row.reminders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen ejecutivo con clases para control de flexbox */}
      <div className="report-summary">
        <div className="summary-item">
          <strong>Usuarios:</strong> {reportData.length}
        </div>
        <div className="summary-item">
          <strong>Tareas:</strong> {totalTasks}
        </div>
        <div className="summary-item">
          <strong>Metas:</strong> {totalGoals}
        </div>
        <div className="summary-item">
          <strong>Recordatorios:</strong> {totalReminders}
        </div>
      </div>

      {/* Contenedor de gráficas que se apilan en móvil gracias al global.css */}
      <div className="report-charts">
        <div className="chart-card">
          <h3>Tareas por usuario</h3>
          <Bar data={tasksBarData} options={chartOptions} />
        </div>
        <div className="chart-card">
          <h3>Metas vs Recordatorios</h3>
          <Doughnut data={goalsRemindersData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default Reports;