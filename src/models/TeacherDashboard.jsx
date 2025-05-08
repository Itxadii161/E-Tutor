// TeacherDashboard.jsx
import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import TopNavigationBar from "./TopNavigationBar";
import WelcomeMessage from "./WelcomeMessage";
import SettingsPage from "./SettingsPage";
import ChatComponent from "./ChatComponent";

const TeacherDashboard = () => {
  const { role, user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("welcome");

  const renderComponent = () => {
    switch (activeTab) {
      case "messages": return <ChatComponent currentUser={user} />;
      case "settings": return <SettingsPage />;
      default: return <WelcomeMessage />;
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-4">
      <TopNavigationBar />
      {role === "tutor" && <WelcomeMessage />}
      
      <div className="flex gap-4 mt-4 border-b border-indigo-200">
        {["welcome", "messages", "settings"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 capitalize ${activeTab === tab ? "text-indigo-700 border-b-2 border-indigo-600" : "text-indigo-500"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default TeacherDashboard;