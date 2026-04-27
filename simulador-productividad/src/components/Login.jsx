import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ sin validación, simplemente redirige
    navigate("/tasks");
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Usuario" />
        <input type="password" placeholder="Contraseña" />
        <button type="submit">Entrar</button>
      </form>
      <p>
        ¿No tienes cuenta? <a href="#">Regístrate aquí</a>
      </p>
    </div>
  );
}

export default Login;
