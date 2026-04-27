import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Usamos la misma lógica de URL que en el Login
const API_BASE = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/auth`
    : "http://localhost:3001/api/auth";

function Plans() {
    const navigate = useNavigate();
    const [updating, setUpdating] = useState(null); // Para saber qué plan se está procesando

    const handleSelectPlan = async (planId) => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            // Si no está logueado, lo mandamos a registrarse con el plan elegido
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

                // --- LANZAR EL EVENTO AQUÍ ---
                window.dispatchEvent(new Event("planUpdated"));
                // -----------------------------

                alert(`¡Felicidades! Ahora tienes el plan ${planId}`);
                // No hace falta navigate si quieres que vea los cambios en el Header ahí mismo
            }
        } catch (err) {
            alert("No se pudo actualizar el plan. Intenta de nuevo.");
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    const planes = [
        { id: "basic", nombre: "Básico", precio: "Gratis", clase: "plan-basico-card" },
        { id: "premium", nombre: "Premium", precio: "$9.99/mes", clase: "plan-premium-card", destacado: true },
        { id: "business", nombre: "Empresarial", precio: "$24.99/mes", clase: "plan-business-card" }
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