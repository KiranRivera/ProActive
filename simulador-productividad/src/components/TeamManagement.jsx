import React, { useState } from "react";
import "../styles/global.css";

function TeamManagement() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Equipo Desarrollo",
      members: [
        { id: 1, name: "Ana", role: "Administrador", active: true },
        { id: 2, name: "Luis", role: "Colaborador", active: true },
        { id: 3, name: "Marta", role: "Lector", active: false },
      ],
    },
    {
      id: 2,
      name: "Marketing",
      members: [
        { id: 4, name: "Carlos", role: "Colaborador", active: true },
        { id: 5, name: "Sofía", role: "Administrador", active: true },
      ],
    },
  ]);

  // Agregar un nuevo miembro a un equipo
  const addMember = (teamId) => {
    const memberName = prompt("Nombre del nuevo miembro:");
    const memberRole = prompt("Rol (Administrador, Colaborador, Lector):");
    if (memberName && memberRole) {
      setTeams((prev) =>
        prev.map((team) =>
          team.id === teamId
            ? {
              ...team,
              members: [
                ...team.members,
                {
                  id: Date.now(),
                  name: memberName,
                  role: memberRole,
                  active: true,
                },
              ],
            }
            : team
        )
      );
    }
  };

  // Cambiar estado activo/inactivo
  const toggleActive = (teamId, memberId) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
            ...team,
            members: team.members.map((m) =>
              m.id === memberId ? { ...m, active: !m.active } : m
            ),
          }
          : team
      )
    );
  };

  // Eliminar miembro
  const removeMember = (teamId, memberId) => {
    setTeams((prev) =>
      prev.map((team) =>
        team.id === teamId
          ? {
            ...team,
            members: team.members.filter((m) => m.id !== memberId),
          }
          : team
      )
    );
  };

  return (
    <div className="teams-page">
      <h2>Administración de Equipos</h2>
      {teams.map((team) => (
        <div key={team.id} className="team-card">
          <h3>{team.name}</h3>
          <button onClick={() => addMember(team.id)}>+ Agregar miembro</button>
          <ul>
            {team.members.map((member) => (
              <li key={member.id}>
                <strong>{member.name}</strong> - {member.role} -{" "}
                {member.active ? "Activo" : "Inactivo"}
                <div className="member-actions">
                  <button
                    className="btn-desactivar"
                    onClick={() => toggleActive(team.id, member.id)}
                  >
                    {member.active ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    className="delete"
                    onClick={() => removeMember(team.id, member.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default TeamManagement;
