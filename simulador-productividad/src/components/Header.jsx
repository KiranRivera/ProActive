import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/header.css";
import logo from "../assets/logo.jpeg";
import profilePic from "../assets/Profile.jpeg";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Usuario");
  const [userPlan, setUserPlan] = useState("basico");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedPlan = localStorage.getItem("userPlan");
    
    if (storedName) setUserName(storedName);
    if (storedPlan) setUserPlan(storedPlan.toLowerCase());
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getPlanClass = () => {
    switch (userPlan) {
      case "premium": return "border-premium";
      case "empresarial": return "border-business";
      default: return "border-basic";
    }
  };

  // --- LÓGICA DE PERMISOS ---
  // El plan básico solo ve estos
  const showPremium = userPlan === "premium" || userPlan === "empresarial";
  const showBusiness = userPlan === "empresarial";

  return (
    <header className="header">
      <div className="left-section">
        <div className="logo">
          <img src={logo} alt="ProActive Logo" className="logo-img" />
        </div>
        <nav className="nav">
          <ul>
            {/* Funciones Básicas (Todos las ven) */}
            <li><Link to="/tasks">Tareas</Link></li>
            <li><Link to="/calendar">Calendario</Link></li>
            <li><Link to="/notes">Notas</Link></li>
             <li><Link to="/plans">Nuestros planes</Link></li>

            {/* Funciones Premium */}
            {showPremium && (
              <>
                <li><Link to="/reminders">Recordatorios</Link></li>
                <li><Link to="/stats">Estadísticas</Link></li>
                <li><Link to="/goals">Metas</Link></li>
              </>
            )}

            {/* Funciones Empresariales */}
            {showBusiness && (
              <>
                <li><Link to="/teams">Equipos</Link></li>
                <li><Link to="/reports">Reportes</Link></li>
                <li><Link to="/activities">Actividades</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="profile-section" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <img 
          src={profilePic} 
          alt="Perfil" 
          className={`profile-img ${getPlanClass()}`} 
        />
        <div className="user-info">
          <span className="profile-name">{userName}</span>
        </div>

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