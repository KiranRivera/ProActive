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
                newPlan: planId // Enviará "basico", "premium" o "empresarial"
            });

            if (response.status === 200) {
                localStorage.setItem("userPlan", planId);

                // Disparamos el evento para que el Header se actualice al instante
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

    // Ajustamos los IDs para que coincidan con la lógica del Header
    const planes = [
        { 
            id: "basico", 
            nombre: "Básico", 
            precio: "Gratis", 
            clase: "plan-basico-card" 
        },
        { 
            id: "premium", 
            nombre: "Premium", 
            precio: "$9.99/mes", 
            clase: "plan-premium-card", 
            destacado: true 
        },
        { 
            id: "empresarial", 
            nombre: "Empresarial", 
            precio: "$24.99/mes", 
            clase: "plan-business-card" 
        }
    ];

    return (
        <div className="plans-wrapper">
            <div className="plans-grid">
                {planes.map((plan) => (
                    <div key={plan.id} className={`plan-card ${plan.clase} ${plan.destacado ? 'destacado' : ''}`}>
                        <h3>{plan.nombre}</h3>
                        <div className="plan-precio">{plan.precio}</div>
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