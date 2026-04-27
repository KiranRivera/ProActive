import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";
import logo from "../assets/logo.jpeg"; 

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/auth` 
  : "http://localhost:3001/api/auth";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. EXTRAER EL PLAN DE LA URL (si existe)
  const queryParams = new URLSearchParams(location.search);
  const selectedPlan = queryParams.get("plan") || "basico";

  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    correo: "",
    ocupacion: "",
    password: "",
    plan: selectedPlan // Se asigna automáticamente
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      ...formData,
      nombre: formData.nombre.trim(),
      correo: formData.correo.toLowerCase().trim(),
      edad: parseInt(formData.edad)
    };

    try {
      const response = await axios.post(`${API_BASE}/register`, dataToSubmit);

      if (response.status === 201) {
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        navigate("/");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Error al conectar con el servidor";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper"> {/* Mismo wrapper azul que el login */}
      <div className="container">    {/* Misma tarjeta blanca que el login */}
        
        <div className="login-header">
          <img src={logo} alt="ProActive Logo" className="login-logo" />
          <h2 className="login-title">Crear Cuenta</h2>
          <p className="footer-text">Únete a la productividad en la nube</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre Completo"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <input
                type="number"
                name="edad"
                placeholder="Edad"
                value={formData.edad}
                onChange={handleChange}
                required
                min="1"
                disabled={loading}
              />
            </div>

            <div className="input-group" style={{ flex: 2 }}>
              <select 
                name="ocupacion" 
                value={formData.ocupacion} 
                onChange={handleChange}
                required
                disabled={loading}
                className="form-select" /* Mantiene estilo de input */
                style={{ padding: '14px', borderRadius: '10px', border: '2px solid #edf2f7', width: '100%', backgroundColor: '#f8fafc' }}
              >
                <option value="">Ocupación</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Trabajador">Trabajador</option>
                <option value="Freelance">Freelance</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              value={formData.correo}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña (mín. 6 caracteres)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn-login" 
            disabled={loading}
          >
            {loading ? <span className="loader-spinner"></span> : "Registrarse Ahora"}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            ¿Ya tienes cuenta?{" "}
            <span onClick={() => navigate("/")} className="link">
              Inicia sesión
            </span>
          </p>
        
          </div>
        </div>
      </div>
  );
}

export default Register;