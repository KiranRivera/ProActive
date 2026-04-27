import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

// 1. CONFIGURACIÓN DE LA URL DINÁMICA
// Prioriza la variable de entorno REACT_APP_API_URL definida en tu .env
const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/calendar` 
  : "http://localhost:3001/api/calendar";

function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // RECUPERAMOS EL ID DEL LOCALSTORAGE
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Usuario";

  // Configuramos el mes actual
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const currentMonth = "2026-04"; 

  useEffect(() => {
    // PROTECCIÓN DE RUTA
    if (!userId) {
      navigate("/");
      return;
    }
    fetchEvents();
  }, [userId, navigate]);

  const fetchEvents = async () => {
    try {
      // Petición al backend en Render (o local)
      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al sincronizar el calendario con la nube:", error);
      setLoading(false);
    }
  };

  const addEvent = async (day) => {
    const eventTitle = prompt("¿Qué evento quieres agendar?");
    if (!eventTitle || eventTitle.trim() === "" || !userId) return;

    const formattedDate = `${currentMonth}-${day.toString().padStart(2, '0')}`;

    try {
      await axios.post(`${API_BASE_URL}/${userId}`, {
        titulo: eventTitle.trim(),
        fecha: formattedDate,
        tipo: "evento",
        color: "#005B97"
      });
      fetchEvents(); // Refresca la lista desde el servidor
    } catch (error) {
      alert("No se pudo guardar el evento en la nube. Revisa tu conexión.");
    }
  };

  const deleteEvent = async (e, eventId) => {
    e.stopPropagation(); 
    if (!window.confirm("¿Deseas eliminar este evento definitivamente?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/${userId}/${eventId}`);
      fetchEvents();
    } catch (error) {
      alert("Error al intentar eliminar el evento.");
    }
  };

  const getEventsForDay = (day) => {
    const formattedDate = `${currentMonth}-${day.toString().padStart(2, '0')}`;
    return events.filter(e => e.fecha === formattedDate);
  };

  if (loading && userId) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Sincronizando agenda con la nube...</p>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <div className="calendar-header-flex">
        <div>
          <h2>Calendario - {currentMonth}</h2>
          <p className="user-context">
            Agenda personal de: <strong>{userName}</strong>
          </p>
        </div>
      </div>

      <div className="calendar-grid">
        {days.map((day) => (
          <div
            key={day}
            className="calendar-day"
            onClick={() => addEvent(day)}
          >
            <span className="day-number">{day}</span>
            <div className="events">
              {getEventsForDay(day).map((event) => (
                <div 
                  key={event.id} 
                  className={`event-item ${event.tipo}`}
                  style={{ borderLeft: `4px solid ${event.color}` }}
                >
                  <p>{event.titulo}</p>
                  <button 
                    className="delete-btn" 
                    onClick={(e) => deleteEvent(e, event.id)}
                    title="Eliminar evento"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;