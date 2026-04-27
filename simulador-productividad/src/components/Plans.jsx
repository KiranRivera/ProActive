import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";

function Plans() {
  const navigate = useNavigate();

  const planes = [
    {
      id: "basic",
      nombre: "Básico",
      precio: "Gratis",
      color: "var(--plan-basico)",
      beneficios: ["Gestión de tareas", "1 proyecto", "Recordatorios básicos", "Soporte comunitario"],
      clase: "plan-basico-card"
    },
    {
      id: "premium",
      nombre: "Premium",
      precio: "$9.99/mes",
      color: "var(--plan-premium)",
      beneficios: ["Tareas ilimitadas", "Proyectos ilimitados", "Análisis de productividad", "IA generativa"],
      clase: "plan-premium-card",
      destacado: true
    },
    {
      id: "business",
      nombre: "Empresarial",
      precio: "$24.99/mes",
      color: "var(--plan-business)",
      beneficios: ["Gestión de equipos", "Roles y permisos", "Reportes avanzados", "Soporte 24/7"],
      clase: "plan-business-card"
    }
  ];

  return (
    <div className="plans-wrapper">
      <div className="plans-header">
        <h2 className="plans-main-title">Elige el plan ideal para tu productividad</h2>
        <p>Potencia tu flujo de trabajo con ProActive</p>
      </div>

      <div className="plans-grid">
        {planes.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.clase} ${plan.destacado ? 'destacado' : ''}`}>
            {plan.destacado && <span className="badge-destacado">Más Popular</span>}
            <h3 className="plan-nombre">{plan.nombre}</h3>
            <div className="plan-precio">{plan.precio}</div>
            
            <ul className="plan-beneficios">
              {plan.beneficios.map((beneficio, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span> {beneficio}
                </li>
              ))}
            </ul>

            <button 
              className="btn-plan" 
              onClick={() => navigate(`/register?plan=${plan.id}`)}
            >
              Seleccionar Plan
            </button>
          </div>
        ))}
      </div>

      <button className="btn-back-login" onClick={() => navigate("/login")}>
        Volver al inicio
      </button>
    </div>
  );
}

export default Plans;