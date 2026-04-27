import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

// 1. CONFIGURACIÓN DE LA URL DINÁMICA
const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/premium/goals` 
  : "http://localhost:3001/api/premium/goals";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Estados para el formulario
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");

  // 2. RECUPERAMOS EL ID REAL DEL USUARIO
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // PROTECCIÓN DE RUTA
    if (!userId) {
      navigate("/");
      return;
    }
    fetchGoals();
  }, [userId, navigate]);

  // 3. Obtener Metas
  const fetchGoals = async () => {
    try {
      // Usamos el userId dinámico que viene del login
      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      setGoals(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar metas desde la nube:", error);
      setLoading(false);
    }
  };

  // 4. Crear Meta
  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!title || !target || !deadline) return alert("Completa todos los campos para crear tu meta.");

    try {
      await axios.post(`${API_BASE_URL}/${userId}`, {
        titulo: title.trim(),
        objetivo: parseInt(target),
        fechaLimite: deadline,
        progreso: 0 // Inicializamos en 0
      });
      setTitle(""); 
      setTarget(""); 
      setDeadline("");
      fetchGoals();
    } catch (error) {
      alert("No se pudo guardar la meta. Intenta de nuevo.");
    }
  };

  // 5. Actualizar Progreso (+1)
  const incrementProgress = async (goalId, currentProgress, targetValue) => {
    if (currentProgress >= targetValue) return;

    try {
      await axios.patch(`${API_BASE_URL}/${userId}/${goalId}`, {
        progreso: currentProgress + 1
      });
      // Actualización optimista para que la UI se sienta rápida
      setGoals(prev => prev.map(g => 
        g.id === goalId ? { ...g, progreso: g.progreso + 1 } : g
      ));
    } catch (error) {
      console.error("Error al actualizar progreso en el servidor");
    }
  };

  // 6. Eliminar Meta
  const handleDelete = async (goalId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta meta? El progreso se perderá.")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${userId}/${goalId}`);
      fetchGoals();
    } catch (error) {
      alert("Error al eliminar la meta");
    }
  };

  if (loading && userId) return <div className="loading">Sincronizando tus metas...</div>;

  return (
    <div className="goals-page">
      <div className="goals-header">
        <h2>Mis Metas</h2>
        <span className="sync-status">Respaldado en la nube</span>
      </div>

      <form className="goal-form" onSubmit={handleAddGoal}>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="¿Qué quieres lograr?" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input 
            type="number" 
            placeholder="Meta numérica (ej: 100)" 
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input 
            type="date" 
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-add">Agregar Meta</button>
      </form>

      <div className="goals-list">
        {goals.map((goal) => {
          const percentage = Math.min(
            Math.round((goal.progreso / goal.objetivo) * 100),
            100
          );

          return (
            <div key={goal.id} className={`goal-card ${percentage === 100 ? 'completed' : ''}`}>
              <div className="goal-header">
                <h3>{goal.titulo}</h3>
                <button className="delete-btn" onClick={() => handleDelete(goal.id)} title="Eliminar">×</button>
              </div>

              <div className="progress-bar-container">
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%`, backgroundColor: percentage === 100 ? '#27ae60' : '#005B97' }}
                ></div>
              </div>

              <div className="goal-info">
                <p><strong>Progreso:</strong> {goal.progreso} de {goal.objetivo} ({percentage}%)</p>
                <p><strong>Fecha límite:</strong> {goal.fechaLimite}</p>
              </div>

              {percentage < 100 && (
                <button 
                  className="update-btn"
                  onClick={() => incrementProgress(goal.id, goal.progreso, goal.objetivo)}
                >
                  + Incrementar Progreso
                </button>
              )}
              
              {percentage === 100 && <div className="complete-badge">¡Meta Alcanzada! 🎉</div>}
            </div>
          );
        })}
        {goals.length === 0 && !loading && (
          <div className="empty-state">
            <p>No tienes metas activas. El mejor momento para empezar es ahora.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Goals;