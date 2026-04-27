import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/auth`
    : "http://localhost:3001/api/auth";

function Plans() {
    const navigate = useNavigate();
    const [updating, setUpdating] = useState(null);

    const handleSelectPlan = async (planId) => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            navigate(`/register?plan=${planId}`);
            return;
        }

        setUpdating(planId);

        try {
            const response = await axios.patch(`${API_BASE}/update-plan`, {
                userId: userId,
                newPlan: planId
            });

            if (response.status === 200) {
                localStorage.setItem("userPlan", planId);
                window.dispatchEvent(new Event("planUpdated"));
                alert(`¡Felicidades! Ahora tienes el plan ${planId}`);
            }
        } catch (err) {
            alert("No se pudo actualizar el plan. Intenta de nuevo.");
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    const planes = [
        { 
            id: "basico", 
            nombre: "Básico", 
            precio: "Gratis", 
            clase: "plan-basico-card",
            beneficios: ["Tareas", "Calendario", "Notas"]
        },
        { 
            id: "premium", 
            nombre: "Premium", 
            precio: "$9.99/mes", 
            clase: "plan-premium-card", 
            destacado: true,
            beneficios: ["Todo lo del plan Básico", "Recordatorios", "Estadísticas", "Metas"]
        },
        { 
            id: "empresarial", 
            nombre: "Empresarial", 
            precio: "$24.99/mes", 
            clase: "plan-business-card",
            beneficios: ["Todo lo del plan Premium", "Equipos", "Reportes por equipo", "Actividades por equipo"]
        }
    ];

    return (
        <div className="plans-wrapper">
            <h2 className="plans-main-title">Mejora tu productividad</h2>
            <div className="plans-grid">
                {planes.map((plan) => (
                    <div key={plan.id} className={`plan-card ${plan.clase} ${plan.destacado ? 'destacado' : ''}`}>
                        {plan.destacado && <span className="badge-destacado">Recomendado</span>}
                        <h3 className="plan-nombre">{plan.nombre}</h3>
                        <div className="plan-precio">{plan.precio}</div>
                        
                        <ul className="plan-beneficios">
                            {plan.beneficios.map((beneficio, index) => (
                                <li key={index} className="beneficio-item">
                                    <span className="check-icon">✓</span> {beneficio}
                                </li>
                            ))}
                        </ul>

                        <button
                            className="btn-plan"
                            onClick={() => handleSelectPlan(plan.id)}
                            disabled={updating !== null}
                        >
                            {updating === plan.id ? "Procesando..." : "Seleccionar Plan"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Plans;