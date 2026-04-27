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

  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

  function Reports() {
    // Datos simulados de productividad por usuario
    const reportData = [
      { user: "Ana", tasks: 15, goals: 3, reminders: 2 },
      { user: "Luis", tasks: 20, goals: 4, reminders: 1 },
      { user: "Marta", tasks: 10, goals: 2, reminders: 3 },
    ];

    // Totales
    const totalTasks = reportData.reduce((acc, r) => acc + r.tasks, 0);
    const totalGoals = reportData.reduce((acc, r) => acc + r.goals, 0);
    const totalReminders = reportData.reduce((acc, r) => acc + r.reminders, 0);

    // Gráfica de distribución de tareas por usuario
    const tasksBarData = {
      labels: reportData.map((r) => r.user),
      datasets: [
        {
          label: "Tareas completadas",
          data: reportData.map((r) => r.tasks),
          backgroundColor: "#005B97", // azul primario
        },
      ],
    };

    // Gráfica donut de metas vs recordatorios
    const goalsRemindersData = {
      labels: ["Metas alcanzadas", "Recordatorios activos"],
      datasets: [
        {
          data: [totalGoals, totalReminders],
          backgroundColor: ["#F7DC4F", "#009E49"], // amarillo y verde
        },
      ],
    };

    return (
      <div className="reports-page">
        <h2>Reportes de Productividad</h2>

        {/* Tabla de métricas */}
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

        {/* Resumen ejecutivo */}
        <div className="report-summary">
          <p>Total de usuarios: {reportData.length}</p>
          <p>Total de tareas completadas: {totalTasks}</p>
          <p>Total de metas alcanzadas: {totalGoals}</p>
          <p>Total de recordatorios activos: {totalReminders}</p>
        </div>

        {/* Gráficas */}
        <div className="report-charts">
          <div className="chart-card">
            <h3>Tareas por usuario</h3>
            <Bar data={tasksBarData} />
          </div>
          <div className="chart-card">
            <h3>Metas vs Recordatorios</h3>
            <Doughnut data={goalsRemindersData} />
          </div>
        </div>
      </div>
    );
  }

  export default Reports;
