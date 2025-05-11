import React, { useContext } from "react";
import StudentDashboard from "../models/StudentDashboard";
import TeacherDashboard from "../models/TeacherDashboard";
import { UserContext } from "../context/UserContext";
const Dashboard = () => {
  const { role } = useContext(UserContext);

  return role === "Teacher" ? <TeacherDashboard /> : <StudentDashboard />;
};

export default Dashboard;
