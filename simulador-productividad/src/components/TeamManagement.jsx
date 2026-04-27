import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/business/teams` 
  : "http://localhost:3001/api/business/teams";

function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userPlan = localStorage.getItem("userPlan");

  useEffect(() => {
    if (!userId) { navigate("/"); return; }
    if (userPlan !== "empresarial") {
      alert("Acceso denegado: Se requiere Plan Empresarial.");
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
      console.error("Error al cargar equipos:", error);
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    try {
      await axios.post(`${API_BASE_URL}/${userId}`, {
        nombre: newTeamName.trim(),
        descripcion: "Equipo gestionado vía ProActive Enterprise"
      });
      setNewTeamName("");
      fetchTeams();
    } catch (error) {
      alert("Error al crear el equipo.");
    }
  };

  const handleAddMember = async (teamId) => {
    const nombre = prompt("Nombre del colaborador:");
    const correo = prompt("Correo corporativo:");
    const role = prompt("Rol (Admin, Editor, Lector):");

    if (nombre && correo && role) {
      try {
        await axios.post(`${API_BASE_URL}/${userId}/${teamId}/members`, {
          nombre: nombre.trim(), 
          correo: correo.toLowerCase().trim(), 
          role: role.trim()
        });
        fetchTeams();
      } catch (error) {
        alert("Error al añadir miembro.");
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
      console.error("Error de conexión");
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    if (!window.confirm("¿Retirar a este miembro del equipo?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${userId}/${teamId}/members/${memberId}`);
      fetchTeams();
    } catch (error) {
      alert("No se pudo eliminar.");
    }
  };

  if (loading && userId) return <div className="loading">Sincronizando organización...</div>;

  return (
    <div className="teams-page">
      <div className="header-flex">
        <div>
          <h2>Administración de Equipos</h2>
        </div>
      </div>

      <div className="create-team-card shadow-sm card-animation">
        <form onSubmit={handleCreateTeam} className="create-team-form">
          <input 
            type="text" 
            placeholder="Nombre del departamento (Ej: Marketing, I+D...)" 
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <button type="submit" className="btn-add-team">Crear Equipo</button>
        </form>
      </div>

      <div className="teams-grid">
        {teams.map((team) => (
          <div key={team.id} className="team-container card-animation">
            <div className="team-header">
              <h3>{team.nombre}</h3>
              <button className="btn-circle-add" onClick={() => handleAddMember(team.id)} title="Añadir Miembro">+</button>
            </div>

            <div className="members-table-header">
              <span>Colaborador</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>

            <ul className="member-list">
              {team.members && team.members.map((member) => (
                <li key={member.id} className="member-row">
                  <div className="member-info">
                    <span className="m-name">{member.nombre}</span>
                    <span className="m-role">{member.role}</span>
                  </div>
                  
                  <div className="member-status">
                    <span className={`status-pill ${member.active ? "active" : "inactive"}`}>
                      {member.active ? "Activo" : "Pausado"}
                    </span>
                  </div>
                  
                  <div className="member-actions">
                    <button
                      className={`btn-action-small ${member.active ? "btn-pause" : "btn-resume"}`}
                      onClick={() => handleToggleStatus(team.id, member.id, member.active)}
                    >
                      {member.active ? "⏸" : "▶"}
                    </button>
                    <button
                      className="btn-action-small btn-delete"
                      onClick={() => handleRemoveMember(team.id, member.id)}
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {(!team.members || team.members.length === 0) && (
              <div className="empty-members-box">Sin colaboradores asignados.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamManagement;