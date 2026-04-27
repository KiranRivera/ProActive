import React, { useState } from "react";
import "../styles/global.css";

function Reminders() {
  const [reminders, setReminders] = useState([
    { id: 1, text: "Reunión con equipo", date: "2026-04-11", time: "09:00" },
    { id: 2, text: "Enviar reporte semanal", date: "2026-04-12", time: "18:00" },
  ]);
  const [newReminder, setNewReminder] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Agregar recordatorio
  const addReminder = (e) => {
    e.preventDefault();
    if (newReminder.trim() === "" || newDate === "" || newTime === "") return;
    const newItem = {
      id: reminders.length + 1,
      text: newReminder,
      date: newDate,
      time: newTime,
    };
    setReminders([...reminders, newItem]);
    setNewReminder("");
    setNewDate("");
    setNewTime("");
  };

  // Eliminar recordatorio
  const deleteReminder = (id) => {
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  return (
    <div className="reminders-page">
      <h2>Recordatorios</h2>

      {/* Formulario para agregar recordatorio */}
      <form className="reminder-form" onSubmit={addReminder}>
        <input
          type="text"
          placeholder="Nuevo recordatorio..."
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
        />
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      {/* Lista de recordatorios */}
      <div className="reminders-list">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="reminder-item">
            <div>
              <span className="reminder-text">{reminder.text}</span>
              <p className="reminder-date">
                {reminder.date} - {reminder.time}
              </p>
            </div>
            <button className="delete" onClick={() => deleteReminder(reminder.id)}>Eliminar</button>
          </div>
        ))}
        {reminders.length === 0 && <p>No hay recordatorios</p>}
      </div>
    </div>
  );
}

export default Reminders;
