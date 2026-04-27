import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

// 1. CONFIGURACIÓN DE LA URL DINÁMICA
const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/premium/reminders` 
  : "http://localhost:3001/api/premium/reminders";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // RECUPERAMOS DATOS DE SESIÓN REAL
  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");

  // Estados para el formulario
  const [newReminder, setNewReminder] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    // 2. PROTECCIÓN DE RUTA Y PLAN
    if (!userId) {
      navigate("/");
      return;
    }

    // Solo Premium y Empresarial tienen acceso a esta sección
    if (userPlan === "basico") {
      alert("Los recordatorios son una función exclusiva de planes Premium.");
      navigate("/tasks");
      return;
    }

    fetchReminders();
  }, [userId, userPlan, navigate]);

  const fetchReminders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      setReminders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al sincronizar recordatorios:", error);
      setLoading(false);
    }
  };

  const addReminder = async (e) => {
    e.preventDefault();
    if (newReminder.trim() === "" || !newDate || !newTime || !userId) return;

    // Formato ISO-ish para el backend
    const combinedDateTime = `${newDate}T${newTime}`;

    try {
      await axios.post(`${API_BASE_URL}/${userId}`, {
        titulo: newReminder.trim(),
        fechaHora: combinedDateTime,
        prioridad: "media",
        color: "#005B97"
      });

      setNewReminder("");
      setNewDate("");
      setNewTime("");
      fetchReminders();
    } catch (error) {
      alert("Hubo un fallo al registrar el aviso en la nube.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar este recordatorio definitivamente?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${userId}/${id}`);
      fetchReminders();
    } catch (error) {
      alert("No se pudo eliminar el registro.");
    }
  };

  if (loading && userId) return <div className="loading">Sincronizando avisos con la nube...</div>;

  return (
    <div className="reminders-page">
      <div className="header-flex">
        <h2>Recordatorios</h2>
        <span className="badge-premium">Premium Feature</span>
      </div>

      <form className="reminder-form shadow-sm" onSubmit={addReminder}>
        <div className="form-row">
          <input
            type="text"
            placeholder="¿Qué necesitas que te recordemos?..."
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-row inputs-inline">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" className="btn-add-reminder" disabled={loading}>
            {loading ? "..." : "Agendar"}
          </button>
        </div>
      </form>

      <div className="reminders-list">
        {reminders.map((reminder) => {
          // Dividimos la fecha y hora para mostrarlas con mejor formato
          const [date, time] = reminder.fechaHora ? reminder.fechaHora.split("T") : ["--", "--"];

          return (
            <div key={reminder.id} className="reminder-item card-animation">
              <div className="reminder-content">
                <div className="reminder-info">
                  <span className="reminder-text">{reminder.titulo}</span>
                  <p className="reminder-date">
                    <span>📅 {date}</span>
                    <span className="time-sep">|</span>
                    <span>⏰ {time}</span>
                  </p>
                </div>
              </div>
              <button 
                className="delete-btn-icon" 
                onClick={() => handleDelete(reminder.id)}
                title="Eliminar recordatorio"
              >
                ×
              </button>
            </div>
          );
        })}
        
        {!loading && reminders.length === 0 && (
          <div className="empty-state">
            <p className="empty-msg">No tienes avisos programados. ¡Todo bajo control! ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reminders;