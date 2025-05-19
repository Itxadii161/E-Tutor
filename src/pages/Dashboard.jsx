import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { getUserData } from "../api/apiService";
import TopNavigationBar from "../components/DashboardComponents/TopNavigationBar";
import WelcomeMessage from "../components/DashboardComponents/WelcomeMessage";
import SettingsPage from "../components/DashboardComponents/SettingsPage";
import ChatComponent from "../components/DashboardComponents/ChatComponent";

const Dashboard = () => {
  const { logout } = useContext(UserContext);
  const [activeComponent, setActiveComponent] = useState('welcome');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await getUserData();
      setUser(data.user || data);
    } catch (err) {
      console.error("Failed to load user", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) fetchUser();
    else console.warn("No token found at dashboard");
  }, []);
  

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <TopNavigationBar
        user={user}
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
        handleLogout={logout}
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full ">
        <div className="bg-white shadow-md rounded-xl p-4 md:p-6 lg:p-8">
          {activeComponent === 'welcome' && <WelcomeMessage />}
          {activeComponent === 'messages' && <ChatComponent currentUser={user} />}
          {activeComponent === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
