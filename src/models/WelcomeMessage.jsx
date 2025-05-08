// WelcomeMessage.jsx
import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const WelcomeMessage = () => {
  const { user, role } = useContext(UserContext);
  if (role !== "tutor") return null;

  return (
    <div className="bg-indigo-100 text-indigo-800 p-4 rounded-lg mb-4">
      <h2 className="font-semibold">Welcome back, {user?.firstName}! Ready for your next session?</h2>
    </div>
  );
};

export default WelcomeMessage;