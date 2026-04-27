import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/premium/goals` 
  : "http://localhost:3001/api/premium/goals";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    // Solo Premium y Empresarial
    if (userPlan === "basico") {
        alert("El seguimiento de metas es una función Premium.");
        navigate("/tasks");
        return;
    }
    fetchGoals();
  }, [userId, userPlan, navigate]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      setGoals(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar metas:", error);
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!title || !target || !deadline) return;

    try {
      await axios.post(`${API_BASE_URL}/${userId}`, {
        titulo: title.trim(),
        objetivo: parseInt(target),
        fechaLimite: deadline,
        progreso: 0
      });
      setTitle(""); 
      setTarget(""); 
      setDeadline("");
      fetchGoals();
    } catch (error) {
      alert("Error al guardar la meta.");
    }
  };

  const incrementProgress = async (goalId, currentProgress, targetValue) => {
    if (currentProgress >= targetValue) return;

    try {
      // Actualización optimista para feedback instantáneo
      setGoals(prev => prev.map(g => 
        g.id === goalId ? { ...g, progreso: g.progreso + 1 } : g
      ));
      await axios.patch(`${API_BASE_URL}/${userId}/${goalId}`, {
        progreso: currentProgress + 1
      });
    } catch (error) {
      fetchGoals(); // Revertir si falla
    }
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm("¿Eliminar esta meta?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${userId}/${goalId}`);
      fetchGoals();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  if (loading && userId) return <div className="loading">Sincronizando metas...</div>;

  return (
    <div className="goals-page">
      <div className="header-flex">
        <div>
          <h2>Mis Metas</h2>
        </div>
        <span className="badge-plan-premium">Objetivos Activos</span>
      </div>

      <div className="goal-form-container shadow-sm card-animation">
        <form className="goal-grid-form" onSubmit={handleAddGoal}>
          <div className="input-group full-width">
            <label>Nombre de la Meta</label>
            <input 
              type="text" 
              placeholder="Ej: Leer 12 libros, Ahorrar para viaje..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Objetivo Numérico</label>
            <input 
              type="number" 
              placeholder="Ej: 100" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Fecha Límite</label>
            <input 
              type="date" 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          <div className="input-group btn-align">
            <button type="submit" className="btn-add-goal">Crear Meta</button>
          </div>
        </form>
      </div>

      <div className="goals-grid">
        {goals.map((goal) => {
          const percentage = Math.min(Math.round((goal.progreso / goal.objetivo) * 100), 100);
          const isCompleted = percentage === 100;

          return (
            <div key={goal.id} className={`goal-card card-animation ${isCompleted ? 'goal-completed' : ''}`}>
              <div className="goal-card-header">
                <h3>{goal.titulo}</h3>
                <button className="btn-delete-subtle" onClick={() => handleDelete(goal.id)}>&times;</button>
              </div>

              <div className="progress-section">
                <div className="progress-labels">
                  <span>{percentage}% completado</span>
                  <span>{goal.progreso} / {goal.objetivo}</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="goal-footer">
                <span className="goal-deadline">📅 Límite: {goal.fechaLimite}</span>
                {!isCompleted ? (
                  <button 
                    className="btn-increment"
                    onClick={() => incrementProgress(goal.id, goal.progreso, goal.objetivo)}
                  >
                    +1
                  </button>
                ) : (
                  <span className="goal-done-icon">🎉</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {goals.length === 0 && !loading && (
        <div className="empty-state-container">
          <div className="icon-bg">🎯</div>
          <p>No hay metas en el radar. ¿Qué quieres lograr hoy?</p>
        </div>
      )}
    </div>
  );
}

export default Goals;