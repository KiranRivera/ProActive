import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

// 1. CONFIGURACIÓN DE LA URL DINÁMICA
const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/premium/dashboard/user` 
  : "http://localhost:3001/api/premium/dashboard/user";

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // RECUPERAMOS DATOS DE SESIÓN
  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");

  useEffect(() => {
    // 2. PROTECCIÓN DE RUTA
    if (!userId) {
      navigate("/");
      return;
    }

    // Solo usuarios Premium o Empresariales pueden ver estadísticas detalladas
    if (userPlan === "basico") {
      alert("Las estadísticas detalladas son una función Premium.");
      navigate("/tasks");
      return;
    }

    fetchStats();
  }, [userId, userPlan, navigate]);

  const fetchStats = async () => {
    try {
      // Petición al backend en la nube para obtener el resumen de rendimiento
      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al sincronizar estadísticas con la nube:", error);
      setLoading(false);
    }
  };

  if (loading && userId) return <div className="loading">Analizando tu productividad en la nube...</div>;
  if (!stats) return <div className="error-state">No se pudieron recuperar tus métricas actuales.</div>;

  // Datos para gráfica circular (Tareas)
  const doughnutData = {
    labels: ["Completadas", "Pendientes"],
    datasets: [
      {
        data: [stats.tareas.completadas, stats.tareas.pendientes],
        backgroundColor: ["#005B97", "#F7DC4F"],
        borderWidth: 1,
      },
    ],
  };

  // Datos para gráfica de barras (Totales)
  const barData = {
    labels: ["Notas", "Recordatorios"],
    datasets: [
      {
        label: "Inventario Digital",
        data: [stats.totales.notas, stats.totales.recordatorios],
        backgroundColor: ["#79A8E8", "#009E49"],
      },
    ],
  };

  // Datos para gráfica de línea (Evolución)
  const lineData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Progreso Diario",
        data: stats.evolucionSemanal, 
        borderColor: "#005B97",
        backgroundColor: "rgba(0, 91, 151, 0.1)",
        fill: true,
        tension: 0.4, 
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <div className="statistics-page">
      <div className="header-flex">
        <div>
          <h2>Mi Rendimiento</h2>
          <p className="subtitle">Visualiza tus logros de la semana</p>
        </div>
        <span className="badge-plan-premium">Plan Premium Activo</span>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card shadow-sm" style={{ borderLeft: "5px solid #005B97" }}>
          <small>Tareas logradas</small>
          <h4>{stats.tareas.completadas}</h4>
        </div>
        <div className="kpi-card shadow-sm" style={{ borderLeft: "5px solid #79A8E8" }}>
          <small>Ideas capturadas</small>
          <h4>{stats.totales.notas}</h4>
        </div>
        <div className="kpi-card shadow-sm" style={{ borderLeft: "5px solid #009E49" }}>
          <small>Recordatorios</small>
          <h4>{stats.totales.recordatorios}</h4>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card card-animation">
          <h3>Efectividad de Tareas</h3>
          <div className="chart-container-fixed">
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className="stat-card card-animation">
          <h3>Volumen de Contenido</h3>
          <div className="chart-container-fixed">
            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        <div className="stat-card wide card-animation">
          <h3>Tendencia Semanal</h3>
          <div className="chart-container-fixed">
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;