import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

// 1. CONFIGURACIÓN DE LA URL DINÁMICA
const API_BASE = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/business` 
  : "http://localhost:3001/api/business";

function Reports() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // RECUPERAMOS DATOS DE SESIÓN REAL
  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");

  useEffect(() => {
    // 2. PROTECCIÓN ESTRICTA DE RUTA
    if (!userId) {
      navigate("/");
      return;
    }

    // Validación de Plan Empresarial
    if (userPlan !== "empresarial") {
      alert("Acceso denegado. Los reportes detallados son exclusivos del Plan Empresarial.");
      navigate("/tasks");
      return;
    }

    fetchTeams();
  }, [userId, userPlan, navigate]);

  const fetchTeams = async () => {
    try {
      // Obtenemos los equipos que administra este usuario desde la nube
      const res = await axios.get(`${API_BASE}/teams/${userId}`);
      setTeams(res.data);
    } catch (err) {
      console.error("Error al cargar equipos desde Render:", err);
    }
  };

  useEffect(() => {
    if (!selectedTeam || !userId) {
      setReportData([]);
      return;
    }
    
    const fetchReport = async () => {
      setLoading(true);
      try {
        // Obtenemos las métricas de rendimiento del equipo seleccionado
        const res = await axios.get(`${API_BASE}/reports/${userId}/${selectedTeam}`);
        setReportData(res.data);
      } catch (err) {
        console.error("Error al generar reporte en la nube:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedTeam, userId]);

  // Cálculos dinámicos para los gráficos
  const totalTasks = reportData.reduce((acc, r) => acc + r.tasks, 0);
  const totalGoals = reportData.reduce((acc, r) => acc + r.goals, 0);
  const totalReminders = reportData.reduce((acc, r) => acc + r.reminders, 0);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position: 'bottom' } }
  };

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

  const goalsRemindersData = {
    labels: ["Metas alcanzadas", "Recordatorios"],
    datasets: [
      {
        data: [totalGoals, totalReminders],
        backgroundColor: ["#F7DC4F", "#009E49"],
      },
    ],
  };

  if (!userId) return null;

  return (
    <div className="reports-page">
      <div className="header-flex">
        <div>
          <h2>Reporte por equipo</h2>
        </div>
      </div>

      <div className="selector-container shadow-sm">
        <div className="selector-group">
          <label>Selecciona un equipo para analizar el rendimiento:</label>
          <div className="select-wrapper">
            <select 
              value={selectedTeam} 
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="custom-select"
            >
              <option value="">-- Listado de Equipos --</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner-blue"></div>
          <p className="loading-text">Calculando métricas en la nube...</p>
        </div>
      )}

      {!selectedTeam && !loading && (
        <div className="empty-state-reports card-animation">
          <div className="icon-placeholder">📈</div>
          <h3>Listo para analizar</h3>
          <p>Selecciona un equipo para visualizar el impacto de tus colaboradores en tiempo real.</p>
        </div>
      )}

      {selectedTeam && reportData.length > 0 && !loading && (
        <div className="fade-in">
          <div className="report-table-container card-animation">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Tareas</th>
                  <th>Metas</th>
                  <th>Avisos</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.user}</strong></td>
                    <td>{row.tasks}</td>
                    <td>{row.goals}</td>
                    <td>{row.reminders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="report-summary-cards">
            <div className="summary-card gold">
              <h4>{reportData.length}</h4>
              <span>Colaboradores</span>
            </div>
            <div className="summary-card blue">
              <h4>{totalTasks}</h4>
              <span>KPI Tareas</span>
            </div>
          </div>

          <div className="report-charts">
            <div className="chart-card shadow-sm">
              <h3>Productividad Individual</h3>
              <Bar data={tasksBarData} options={chartOptions} />
            </div>
            <div className="chart-card shadow-sm">
              <h3>Distribución de Objetivos</h3>
              <Doughnut data={goalsRemindersData} options={chartOptions} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;