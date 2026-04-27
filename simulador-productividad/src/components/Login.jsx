import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

// 1. CONFIGURACIÓN DE LA URL DINÁMICA
const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/auth` 
  : "http://localhost:3001/api/auth";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Petición al endpoint de autenticación en la nube
      const response = await axios.post(`${API_BASE}/login`, { 
        correo: correo.toLowerCase().trim(), 
        password 
      });

      if (response.status === 200) {
        // 1. Guardamos la sesión en el navegador
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("userName", response.data.nombre);
        localStorage.setItem("userPlan", response.data.plan);
        
        // 2. Redirección inmediata
        navigate("/tasks"); 
      }
    } catch (err) {
      // Manejo de errores de conexión o credenciales
      const errorMsg = err.response?.data?.error || "Error de conexión con el servidor";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="container">
        <h2 className="login-title">ProActive</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required 
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <span className="loader-text">Verificando...</span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            ¿No tienes cuenta? <span onClick={() => navigate("/register")} className="link">Crea una aquí</span>
          </p>
          {process.env.NODE_ENV === 'development' && (
             <small style={{color: '#888', display: 'block', marginTop: '10px'}}>
               Conectado a: {API_BASE}
             </small>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;