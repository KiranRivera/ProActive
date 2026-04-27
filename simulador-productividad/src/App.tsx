import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useEffect } from "react";
import Login from "./components/Login";
import TaskList from "./components/TaskList";
import Header from "./components/Header";
import Calendar from "./components/Calendar";
import Notes from "./components/Notes";
import Reminders from "./components/Reminder";
import Statistics from "./components/Statistics";
import Goals from "./components/Goals";
import TeamManagement from "./components/TeamManagement";
import Reports from "./components/Reports";
import ActivityControl from "./components/ActivityControl";
import Register from "./components/Register";

// 1. Configuración de la API para Vite
// Usamos import.meta.env en lugar de process.env
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const AppLayout = () => (
  <>
    <Header />
    <Outlet /> 
  </>
);

function App() {
  
  // Bloque de depuración: Verás esto en la consola (F12) al cargar la app
  useEffect(() => {
    console.log("🚀 ProActive inicializado");
    console.log("📡 Conectando a la API en:", API_BASE);
    
    if (!import.meta.env.VITE_API_URL && window.location.hostname !== 'localhost') {
      console.warn("⚠️ Advertencia: VITE_API_URL no está definida en el entorno de producción.");
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* RUTA SIN HEADER: El Login y Registro son independientes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* RUTAS CON HEADER: Todas estas pasan por el AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/teams" element={<TeamManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/activities" element={<ActivityControl />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;