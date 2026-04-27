import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/premium/reminders` 
  : "http://localhost:3001/api/premium/reminders";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");

  const [newReminder, setNewReminder] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
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
    if (!window.confirm("¿Deseas eliminar este recordatorio?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${userId}/${id}`);
      fetchReminders();
    } catch (error) {
      alert("No se pudo eliminar el registro.");
    }
  };

  if (loading && userId) return <div className="loading">Sincronizando avisos...</div>;

  return (
    <div className="reminders-page">
      <div className="header-flex">
        <div>
          <h2>Recordatorios</h2>
        </div>
   
      </div>

      {/* Formulario Rediseñado */}
      <div className="reminder-form-container shadow-sm card-animation">
        <form className="reminder-grid-form" onSubmit={addReminder}>
          <div className="input-group full-width">
            <label>¿Qué debemos recordarte?</label>
            <input
              type="text"
              placeholder="Ej: Reunión de presupuesto, Tomar medicina..."
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Fecha</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Hora</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
            />
          </div>
          <div className="input-group btn-align">
            <button type="submit" className="btn-agendar" disabled={loading}>
              {loading ? "..." : "Agendar"}
            </button>
          </div>
        </form>
      </div>

      {/* Listado de Recordatorios */}
      <div className="reminders-grid">
        {reminders.map((reminder) => {
          const [date, time] = reminder.fechaHora ? reminder.fechaHora.split("T") : ["--", "--"];
          return (
            <div key={reminder.id} className="reminder-card card-animation">
              <div className="reminder-tag" style={{ backgroundColor: reminder.color }}></div>
              <div className="reminder-body">
                <span className="reminder-title">{reminder.titulo}</span>
                <div className="reminder-meta">
                  <span>📅 {date}</span>
                  <span className="dot">•</span>
                  <span>⏰ {time}</span>
                </div>
              </div>
              <button 
                className="btn-delete-subtle" 
                onClick={() => handleDelete(reminder.id)}
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>

      {!loading && reminders.length === 0 && (
        <div className="empty-state-container">
          <div className="icon-bg">🔔</div>
          <p>No tienes avisos programados. ¡Todo bajo control!</p>
        </div>
      )}
    </div>
  );
}

export default Reminders;