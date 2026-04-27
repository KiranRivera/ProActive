import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ Sin validación para la PoC, redirige directamente
    navigate("/tasks");
  };

  return (
    <div className="login-wrapper">
      <div className="container">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Usuario" 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Contraseña" 
              required 
            />
          </div>
          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>
        <p className="footer-text">
          ¿No tienes cuenta? <a href="#">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}

export default Login;