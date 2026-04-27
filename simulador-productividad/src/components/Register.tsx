import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css"; // Asegúrate de que aquí estén tus estilos de login

function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    correo: "",
    ocupacion: "",
    password: "" // Añadido por funcionalidad
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Datos de registro:", formData);
    // Aquí iría tu lógica con Firebase o API
    alert("¡Registro exitoso!");
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Crear Cuenta</h2>
          <p>Únete a ProActive y organiza tu vida</p>
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
            />
          </div>

          <div className="form-group">
            <label>Ocupación</label>
            <select 
              name="ocupacion" 
              value={formData.ocupacion} 
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Selecciona tu ocupación</option>
              <option value="Estudiante">Estudiante</option>
              <option value="Trabajador">Trabajador</option>
              <option value="Freelance">Freelance</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-button">
            Registrarse
          </button>
        </form>

        <div className="login-footer">
          <p>¿Ya tienes cuenta? <span onClick={() => navigate("/")} className="link">Inicia sesión</span></p>
        </div>
      </div>
    </div>
  );
}

export default Register;