import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

// 1. CONFIGURACIÓN DE LA URL DINÁMICA
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/notes` 
  : "http://localhost:3001/api/notes";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  // RECUPERAMOS LOS DATOS DEL LOCALSTORAGE
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Usuario";

  useEffect(() => {
    // PROTECCIÓN DE RUTA
    if (!userId) {
      navigate("/");
      return;
    }
    fetchNotes();
  }, [userId, navigate]);

  const fetchNotes = async () => {
    try {
      // Petición al backend en la nube
      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      setNotes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error cargando notas desde la nube:", error);
      setLoading(false);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (newTitle.trim() === "" || newContent.trim() === "" || !userId) return;

    try {
      await axios.post(`${API_BASE_URL}/${userId}`, {
        titulo: newTitle.trim(),      
        contenido: newContent.trim(), 
        color: "#FFFFFF"       
      });
      
      setNewTitle("");
      setNewContent("");
      fetchNotes(); // Sincroniza la lista
    } catch (error) {
      alert("No se pudo guardar la nota en el servidor.");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta nota? No se podrá recuperar.")) return;

    try {
      await axios.delete(`${API_BASE_URL}/${userId}/${noteId}`);
      fetchNotes(); 
    } catch (error) {
      alert("Error al intentar eliminar la nota.");
    }
  };

  if (loading && userId) {
    return (
      <div className="loading-container">
        <p>Recuperando tus notas...</p>
      </div>
    );
  }

  return (
    <div className="notes-page">
      <div className="header-flex">
        <h2>Mis Notas</h2>
        <div className="user-info-badge">
          Ideado por: <strong>{userName}</strong>
        </div>
      </div>

      <form className="note-form shadow-sm" onSubmit={addNote}>
        <input
          type="text"
          placeholder="Título de la idea..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Escribe lo que estás pensando..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          required
        />
        <button type="submit" className="btn-add-note">
          Agregar
        </button>
      </form>

      <div className="notes-grid">
        {notes.map((note) => (
          <div key={note.id} className="note-item card-animation" style={{ backgroundColor: note.color || "#fff" }}>
            <div className="note-content-wrapper">
              <h3>{note.titulo}</h3>
              <p>{note.contenido}</p>
            </div>
            <div className="note-actions">
              <button className="delete-btn-minimal" onClick={() => handleDeleteNote(note.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
        
        {!loading && notes.length === 0 && (
          <div className="empty-state">
            <div className="icon-notes-empty">📝</div>
            <p>Tu bloc de notas está vacío. ¡Empieza a escribir!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;