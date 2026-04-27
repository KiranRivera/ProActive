import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

// 1. CONFIGURACIÓN DE LA URL DINÁMICA
const API_BASE_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/business/teams` 
  : "http://localhost:3001/api/business/teams";

function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState("");
  
  const navigate = useNavigate();

  // RECUPERAMOS DATOS DE SESIÓN REAL
  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");

  useEffect(() => {
    // 2. PROTECCIÓN DE RUTA
    if (!userId) {
      navigate("/");
      return;
    }

    if (userPlan !== "empresarial") {
      alert("La gestión de equipos es exclusiva del Plan Empresarial.");
      navigate("/tasks");
      return;
    }

    fetchTeams();
  }, [userId, userPlan, navigate]);

  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      setTeams(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar equipos desde la nube:", error);
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim() || !userId) return;
    try {
      await axios.post(`${API_BASE_URL}/${userId}`, {
        nombre: newTeamName.trim(),
        descripcion: "Nuevo equipo gestionado vía ProActive Cloud"
      });
      setNewTeamName("");
      fetchTeams();
    } catch (error) {
      alert("Error al crear el equipo en el servidor.");
    }
  };

  const handleAddMember = async (teamId) => {
    const nombre = prompt("Nombre del nuevo miembro:");
    const role = prompt("Rol (Administrador, Colaborador, Lector):");
    const correo = prompt("Correo electrónico:");

    if (nombre && role && correo) {
      try {
        await axios.post(`${API_BASE_URL}/${userId}/${teamId}/members`, {
          nombre: nombre.trim(), 
          correo: correo.toLowerCase().trim(), 
          role: role.trim()
        });
        fetchTeams();
      } catch (error) {
        alert("No se pudo añadir al miembro. Verifica los datos.");
      }
    }
  };

  const handleToggleStatus = async (teamId, memberId, currentStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/${userId}/${teamId}/members/${memberId}`, {
        active: !currentStatus
      });
      fetchTeams();
    } catch (error) {
      console.error("Error al cambiar estado en la nube");
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    if (!window.confirm("¿Estás seguro de eliminar a este miembro del equipo?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${userId}/${teamId}/members/${memberId}`);
      fetchTeams();
    } catch (error) {
      alert("Error al eliminar miembro");
    }
  };

  if (loading && userId) return <div className="loading">Sincronizando estructura de equipos...</div>;

  return (
    <div className="teams-page">
      <div className="header-flex">
        <h2>Administración de Equipos</h2>
      </div>

      <div className="team-card shadow-sm">
        <form onSubmit={handleCreateTeam} className="create-team-form">
          <input 
            type="text" 
            placeholder="Nombre del nuevo departamento o equipo..." 
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="input-main"
          />
          <button type="submit" className="btn-add-team">
            Crear Equipo
          </button>
        </form>
      </div>

      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-card card-animation">
            <div className="team-card-header">
              <h3>{team.nombre}</h3>
              <button 
                className="btn-add-member-icon" 
                onClick={() => handleAddMember(team.id)}
                title="Añadir Miembro"
              >
                +
              </button>
            </div>

            <ul className="member-list">
              {team.members && team.members.map((member) => (
                <li key={member.id} className="member-item">
                  <div className="member-info">
                    <div className="member-main">
                      <strong>{member.nombre}</strong>
                      <span className="member-role">{member.role}</span>
                    </div>
                    <span className={`status-dot ${member.active ? "active" : "inactive"}`}>
                      {member.active ? "● Activo" : "● Inactivo"}
                    </span>
                  </div>
                  
                  <div className="member-actions">
                    <button
                      className={`btn-status ${member.active ? "warn" : "success"}`}
                      onClick={() => handleToggleStatus(team.id, member.id, member.active)}
                    >
                      {member.active ? "Pausar" : "Activar"}
                    </button>
                    <button
                      className="btn-delete-member"
                      onClick={() => handleRemoveMember(team.id, member.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {(!team.members || team.members.length === 0) && (
              <p className="empty-members">Sin colaboradores asignados.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamManagement;