import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // O puedes usar tu archivo api/axiosConfig si ya lo creaste
import "../styles/global.css";

// 1. URL DINÁMICA: Usamos la de Render en producción o localhost en desarrollo
const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/business` 
  : "http://localhost:3001/api/business";

function ActivityControl() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  
  const navigate = useNavigate();

  // 2. RECUPERAMOS DATOS DE SESIÓN
  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");

  useEffect(() => {
    // PROTECCIÓN DE RUTA
    if (!userId) {
      navigate("/");
      return;
    }

    if (userPlan !== "empresarial") {
      alert("Esta función es exclusiva para organizaciones con Plan Empresarial.");
      navigate("/tasks");
      return;
    }

    fetchTeams();
  }, [userId, userPlan, navigate]);

  const fetchTeams = async () => {
    try {
      const res = await axios.get(`${API_BASE}/teams/${userId}`);
      setTeams(res.data);
    } catch (err) {
      console.error("Error conectando con el servicio de equipos:", err);
    }
  };

  // Cargar actividades y miembros cuando cambie el equipo
  useEffect(() => {
    if (!selectedTeam || !userId) {
      setActivities([]);
      setMembers([]);
      return;
    }
    fetchActivities();
    fetchMembers();
  }, [selectedTeam, userId]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/activities/${userId}/${selectedTeam}`);
      setActivities(res.data);
    } catch (err) {
      console.error("Error al sincronizar actividades:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/activities/teams/${userId}/${selectedTeam}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error("Error al obtener nómina del equipo:", err);
    }
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    if (!newTask || !targetEmail) return alert("Por favor, describe la tarea y selecciona un responsable.");

    try {
      await axios.post(`${API_BASE}/activities/${userId}/${selectedTeam}`, {
        tarea: newTask,
        correo: targetEmail
      });
      setNewTask("");
      setTargetEmail("");
      fetchActivities(); 
    } catch (err) {
      alert(err.response?.data?.error || "Hubo un problema al asignar la actividad.");
    }
  };

  const updateStatus = async (activityId, newStatus) => {
    try {
      await axios.patch(`${API_BASE}/activities/${userId}/${selectedTeam}/${activityId}`, {
        status: newStatus
      });
      setActivities(prev =>
        prev.map(act => act.id === activityId ? { ...act, status: newStatus } : act)
      );
    } catch (err) {
      alert("No se pudo actualizar el estado de la tarea.");
    }
  };

  return (
    <div className="activities-page">
      <div className="header-flex">
        <h2>Control de Actividades</h2>
      </div>

      <div className="selector-container">
        <div className="selector-group">
          <label>Equipo de trabajo</label>
          <div className="select-wrapper">
            <select 
              value={selectedTeam} 
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="custom-select"
            >
              <option value="">Selecciona un equipo para gestionar...</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selectedTeam && (
        <div className="activity-form-container">
          <form onSubmit={handleCreateActivity} className="activity-form">
            <div className="form-inputs">
              <div className="input-group">
                <label>Nueva asignación</label>
                <input 
                  type="text" 
                  placeholder="Descripción de la actividad..." 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label>Responsable</label>
                <select 
                  value={targetEmail} 
                  onChange={(e) => setTargetEmail(e.target.value)}
                  className="custom-select"
                >
                  <option value="">Seleccionar colaborador...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.correo}>{m.nombre} ({m.correo})</option>
                  ))}
                </select>
              </div>
              
              <button type="submit" className="btn-add-activity" disabled={loading}>
                Asignar Tarea
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading-status">Sincronizando con la nube...</div>
      ) : (
        <div className="activity-grid">
          {activities
            .filter(act => act.status !== "Completada")
            .map((act) => (
              <div key={act.id} className={`activity-card ${act.status.toLowerCase().replace(/\s+/g, '-')}`}>
                <h3>{act.tarea}</h3>
                <div className="activity-info">
                  <p><strong>👤 Asignado a:</strong> {act.assignedTo}</p>
                  <p><strong>📊 Estado actual:</strong> {act.status}</p>
                </div>
                
                <div className="activity-actions">
                  <button 
                    className={act.status === "Pendiente" ? "active" : ""} 
                    onClick={() => updateStatus(act.id, "Pendiente")}
                  >
                    Pendiente
                  </button>
                  <button 
                    className={act.status === "En progreso" ? "active" : ""} 
                    onClick={() => updateStatus(act.id, "En progreso")}
                  >
                    En curso
                  </button>
                  <button 
                    className="btn-complete"
                    onClick={() => updateStatus(act.id, "Completada")}
                  >
                    Completada ✅
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      
      {selectedTeam && activities.filter(act => act.status !== "Completada").length === 0 && !loading && (
        <div className="all-done">
          <p>🎉 ¡Excelente! No hay tareas pendientes en este equipo.</p>
        </div>
      )}
    </div>
  );
}

export default ActivityControl;