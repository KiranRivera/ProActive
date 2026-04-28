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
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, BarElement, PointElement, LineElement
);

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/premium/dashboard/user` 
  : "http://localhost:3001/api/premium/dashboard/user";

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userPlan = (localStorage.getItem("userPlan") || "basico").toLowerCase();

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    fetchStats();
  }, [userId, navigate]);

  // --- MOTOR DE FEEDBACK INTELIGENTE ---
  const generateFeedback = (data) => {
    const suggestions = [];
    const { tareas, totales } = data;

    // 1. Recomendaciones para TODOS (Basado en Tareas/Notas)
    if (tareas.pendientes > tareas.completadas) {
      suggestions.push({
        tipo: "General",
        texto: "Tienes muchas tareas pendientes. Intenta desglosarlas en pequeñas notas para avanzar más rápido.",
        icono: "📝",
        color: "#79A8E8"
      });
    }

    // 2. Recomendaciones PREMIUM (Recordatorios/Metas/Estadísticas)
    if (userPlan === "premium" || userPlan === "empresarial") {
      if (totales.recordatorios < 3) {
        suggestions.push({
          tipo: "Premium",
          texto: "Tu uso de recordatorios es bajo. Configura alertas para no perder el ritmo de tu tendencia semanal.",
          icono: "🔔",
          color: "#FFD700"
        });
      }
      suggestions.push({
        tipo: "Optimización",
        texto: "Tu tendencia muestra picos de energía. Usa la sección de Metas para fijar objetivos en tus días más productivos.",
        icono: "🎯",
        color: "#FFD700"
      });
    }

    // 3. Recomendaciones EMPRESARIAL (Equipos/Actividades)
    if (userPlan === "empresarial") {
      suggestions.push({
        tipo: "Equipo",
        texto: "Buen trabajo individual. Revisa el módulo de Equipos para delegar tareas y ver reportes grupales.",
        icono: "👥",
        color: "#4CAF50"
      });
    }

    // 4. Sugerencia de Upgrade para Básico
    if (userPlan === "basico") {
      suggestions.push({
        tipo: "ProActive+",
        texto: "¡Estás rindiendo bien! Con el plan Premium podrías usar Recordatorios y Metas para potenciar estos números.",
        icono: "🚀",
        color: "#005B97",
        isPromo: true
      });
    }

    setRecommendations(suggestions);
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      setStats(response.data);
      generateFeedback(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al sincronizar estadísticas:", error);
      setLoading(false);
    }
  };

  if (loading && userId) return <div className="loading">Analizando tu productividad en la nube...</div>;
  if (!stats) return <div className="error-state">No se pudieron recuperar tus métricas.</div>;

  // Gráficas (Mantenemos tu lógica de datos)
  const doughnutData = {
    labels: ["Completadas", "Pendientes"],
    datasets: [{
      data: [stats.tareas.completadas, stats.tareas.pendientes],
      backgroundColor: ["#005B97", "#F7DC4F"],
      borderWidth: 1,
    }],
  };

  const barData = {
    labels: ["Notas", "Recordatorios"],
    datasets: [{
      label: "Inventario Digital",
      data: [stats.totales.notas, stats.totales.recordatorios],
      backgroundColor: ["#79A8E8", "#4CAF50"],
    }],
  };

  const lineData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [{
      label: "Progreso Diario",
      data: stats.evolucionSemanal, 
      borderColor: "#005B97",
      backgroundColor: "rgba(0, 91, 151, 0.1)",
      fill: true,
      tension: 0.4, 
    }],
  };

  return (
    <div className="statistics-page" style={{ padding: '20px' }}>
      <div className="header-flex">
        <div>
          <h2>Mi Rendimiento</h2>
          <p className="subtitle">Análisis inteligente basado en tu plan <strong>{userPlan}</strong></p>
        </div>
      </div>

      {/* SECCIÓN DE FEEDBACK DINÁMICO */}
      <div className="feedback-container" style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '15px' }}>Feedback Inteligente</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
          {recommendations.map((rec, index) => (
            <div key={index} className="stat-card" style={{ 
              borderLeft: `6px solid ${rec.color}`, 
              display: 'flex', 
              gap: '15px', 
              alignItems: 'center',
              padding: '15px',
              backgroundColor: rec.isPromo ? '#f0f7ff' : '#fff'
            }}>
              <span style={{ fontSize: '2rem' }}>{rec.icono}</span>
              <div>
                <strong style={{ color: rec.color, fontSize: '0.8rem', textTransform: 'uppercase' }}>{rec.tipo}</strong>
                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#444', lineHeight: '1.4' }}>{rec.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI GRID */}
      <div className="kpi-grid">
        <div className="kpi-card shadow-sm" style={{ borderLeft: "5px solid #005B97" }}>
          <small>Tareas logradas</small>
          <h4>{stats.tareas.completadas}</h4>
        </div>
        <div className="kpi-card shadow-sm" style={{ borderLeft: "5px solid #79A8E8" }}>
          <small>Ideas capturadas</small>
          <h4>{stats.totales.notas}</h4>
        </div>
        <div className="kpi-card shadow-sm" style={{ borderLeft: "5px solid #4CAF50" }}>
          <small>Recordatorios</small>
          <h4>{stats.totales.recordatorios}</h4>
        </div>
      </div>

      {/* GRÁFICAS */}
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