import React, { useState } from "react";
import "../styles/global.css";

function Notes() {
  const [notes, setNotes] = useState([
    { id: 1, title: "Idea de proyecto", content: "Explorar app de productividad" },
    { id: 2, title: "Recordatorio", content: "Comprar libro de matemáticas" },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // Agregar nota
  const addNote = (e) => {
    e.preventDefault();
    if (newTitle.trim() === "" || newContent.trim() === "") return;
    const newNote = {
      id: notes.length + 1,
      title: newTitle,
      content: newContent,
    };
    setNotes([...notes, newNote]);
    setNewTitle("");
    setNewContent("");
  };

  // Eliminar nota
  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="notes-page">
      <h2>Notas</h2>

      {/* Formulario para agregar nota */}
      <form className="note-form" onSubmit={addNote}>
        <input
          type="text"
          placeholder="Título de la nota..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Contenido de la nota..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button type="submit">Agregar Nota</button>
      </form>

      {/* Lista de notas */}
      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.id} className="note-item">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button className="delete" onClick={() => deleteNote(note.id)}>Eliminar</button>
          </div>
        ))}
        {notes.length === 0 && <p>No hay notas guardadas</p>}
      </div>
    </div>
  );
}

export default Notes;
