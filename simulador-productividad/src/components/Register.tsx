import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

// 1. CONFIGURACIÓN DE LA URL DINÁMICA
const API_BASE = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL}/auth` 
  : "http://localhost:3001/api/auth";

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    correo: "",
    ocupacion: "",
    password: "",
    plan: "basico" // Valor por defecto
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Limpieza básica de datos antes de enviar
    const dataToSubmit = {
      ...formData,
      nombre: formData.nombre.trim(),
      correo: formData.correo.toLowerCase().trim(),
      edad: parseInt(formData.edad)
    };

    try {
      // Petición al endpoint de registro en la nube
      const response = await axios.post(`${API_BASE}/register`, dataToSubmit);

      if (response.status === 201) {
        alert("¡Registro exitoso en ProActive Cloud! Ahora puedes iniciar sesión.");
        navigate("/");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Error al conectar con el servidor de registro";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Crear Cuenta</h2>
          <p>Únete a ProActive y sincroniza tus datos en la nube</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej. Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Edad</label>
            <input
              type="number"
              name="edad"
              placeholder="Tu edad"
              value={formData.edad}
              onChange={handleChange}
              required
              min="1"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              placeholder="correo@ejemplo.com"
              value={formData.correo}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="row-group" style={{ display: 'flex', gap: '10px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Ocupación</label>
              <select 
                name="ocupacion" 
                value={formData.ocupacion} 
                onChange={handleChange}
                required
                className="form-select"
                disabled={loading}
              >
                <option value="">Selecciona</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Trabajador">Trabajador</option>
                <option value="Freelance">Freelance</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Plan de Usuario</label>
              <select 
                name="plan" 
                value={formData.plan} 
                onChange={handleChange}
                required
                className="form-select"
                disabled={loading}
              >
                <option value="basico">Básico (Azul)</option>
                <option value="premium">Premium (Amarillo)</option>
                <option value="empresarial">Empresarial (Verde)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? "Sincronizando..." : "Registrarse Ahora"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            ¿Ya tienes cuenta?{" "}
            <span onClick={() => navigate("/")} className="link">
              Inicia sesión
            </span>
          </p>
          {process.env.NODE_ENV === 'development' && (
            <small style={{color: '#888', display: 'block', marginTop: '10px', textAlign: 'center'}}>
              Target: {API_BASE}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;