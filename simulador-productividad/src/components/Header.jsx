import React from "react";
import "../styles/header.css";
import logo from "../assets/logo.jpeg";
import profilePic from "../assets/Profile.jpeg"; // tu imagen de perfil

function Header() {
  return (
    <header className="header">
      <div className="left-section">
        <div className="logo">
          <img src={logo} alt="ProActive Logo" className="logo-img" />
        </div>
        <nav className="nav">
          <ul>
            <li><a href="/tasks">Tareas</a></li>
            <li><a href="/calendar">Calendario</a></li>
            <li><a href="/notes">Notas</a></li>
            <li><a href="/reminders">Recordatorios</a></li>
            <li><a href="/stats">Mis Estadísticas</a></li>
            <li><a href="/goals">Mis Metas</a></li>
            <li><a href="/teams">Mis equipos</a></li>
            <li><a href="/reports">Reportes</a></li>
            <li><a href="/activities">Actividades</a></li>
          </ul>
        </nav>
      </div>

      <div className="profile-section">
        <img src={profilePic} alt="Perfil" className="profile-img" />
        <span className="profile-name">Emanuel</span>
      </div>
    </header>
  );
}

export default Header;
