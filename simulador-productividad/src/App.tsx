import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Header /> {/* ✅ Header siempre visible */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/calendar" element={<Calendar/>} />
        <Route path="/notes" element={<Notes/>} />
        <Route path="/reminders" element={<Reminders/>} />
        <Route path="/stats" element={<Statistics/>} />
        <Route path="/goals" element={<Goals/>} />
        <Route path="/teams" element={<TeamManagement/>} />
        <Route path="/reports" element={<Reports/>} />
        <Route path="/activities" element={<ActivityControl/>} />
      </Routes>
    </Router>
  );
}

export default App;
