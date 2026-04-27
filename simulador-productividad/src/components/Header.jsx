import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import logo from "../assets/logo.jpeg";
import profilePic from "../assets/Profile.jpeg";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Aquí puedes limpiar el localStorage o estados de auth si los usas
    console.log("Cerrando sesión...");
    navigate("/");
  };

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

      <div className="profile-section" onClick={toggleMenu} style={{ cursor: 'pointer', position: 'relative' }}>
        <img src={profilePic} alt="Perfil" className="profile-img" />
        <span className="profile-name">Emanuel</span>

        {/* Menú desplegable */}
        {isMenuOpen && (
          <div className="profile-dropdown">
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;