import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import TopNavigationBar from "./TopNavigationBar";
import WelcomeMessage from "./WelcomeMessage";
import SettingsPage from "./SettingsPage";
import ChatComponent from "./ChatComponent";

const StudentDashboard = () => {
  const { role, user } = useContext(UserContext); // Access role and user context
  const [activeComponent, setActiveComponent] = useState('welcome'); // Use a string for comparison

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Navigation Bar */}
      <TopNavigationBar />
      
      {/* Welcome Message */}
      {/* {role === "tutor" && <WelcomeMessage />} */}

      {/* Dashboard Content */}
      <div className="bg-white shadow-md rounded-xl mt-4 p-4 flex gap-6">
        <button
          onClick={() => setActiveComponent('welcome')}
          className={`pb-1 font-semibold ${
            activeComponent === 'welcome' ? "border-b-2 border-black" : "text-gray-500"
          }`}
        >
          Welcome
        </button>
        <button
          onClick={() => setActiveComponent('messages')}
          className={`pb-1 font-semibold ${
            activeComponent === 'messages' ? "border-b-2 border-black" : "text-gray-500"
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveComponent('settings')}
          className={`pb-1 font-semibold ${
            activeComponent === 'settings' ? "border-b-2 border-black" : "text-gray-500"
          }`}
        >
          Settings
        </button>
      </div>

      {/* Display Active Component */}
      <div className="mt-6">
        {activeComponent === 'welcome' && <WelcomeMessage />}
        {activeComponent === 'messages' && <ChatComponent currentUser={user} />}
        {activeComponent === 'settings' && <SettingsPage />}
      </div>
    </div>
  );
};

export default StudentDashboard;
