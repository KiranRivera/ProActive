import React, { useState } from "react";
import "../styles/global.css";

function Calendar() {
  // Generamos los días del mes (ejemplo: 30 días)
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  // Estado inicial con un evento y un recordatorio ya cargados
  const [events, setEvents] = useState({
    5: [{ type: "evento", text: "Reunión de equipo" }],
    10: [{ type: "recordatorio", text: "Enviar reporte semanal" }],
  });

  // Agregar evento manual
  const addEvent = (day) => {
    const eventTitle = prompt("Ingrese el nombre del evento:");
    if (eventTitle && eventTitle.trim() !== "") {
      setEvents((prev) => {
        const dayEvents = prev[day] || [];
        return { ...prev, [day]: [...dayEvents, { type: "evento", text: eventTitle }] };
      });
    }
  };

  // Función para agregar recordatorio desde otro módulo
  const addReminderToCalendar = (day, text) => {
    setEvents((prev) => {
      const dayEvents = prev[day] || [];
      return { ...prev, [day]: [...dayEvents, { type: "recordatorio", text }] };
    });
  };

  return (
    <div className="calendar-page">
      <h2>Calendario</h2>
      <div className="calendar-grid">
        {days.map((day) => (
          <div
            key={day}
            className="calendar-day"
            onClick={() => addEvent(day)}
          >
            <span className="day-number">{day}</span>
            <div className="events">
              {events[day]?.map((event, index) => (
                <p
                  key={index}
                  className={event.type === "evento" ? "event" : "reminder"}
                >
                  {event.text}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
