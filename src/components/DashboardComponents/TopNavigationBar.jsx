import React, { useState, useEffect } from "react";
import { LogOut, Menu } from "lucide-react";

const TopNavigationBar = ({ user, activeComponent, setActiveComponent, handleLogout }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "welcome", label: "Welcome" },
    { id: "messages", label: "Messages" },
    { id: "settings", label: "Settings" },
  ];

  const roleLabels = {
    tutor: "Tutor",
    student: "Student",
    "pending-tutor": "Pending Approval",
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const profileImageUrl = user?.image || "/default-profile.png";

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md p-4 flex items-center justify-between">
      {/* Left: User Info */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            <img
              src={profileImageUrl}
              alt={`${user?.firstName} ${user?.lastName}`}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/default-profile.png")}
            />
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-indigo-600"></span>
          )}
        </div>
        <div>
          <h3 className="font-medium text-sm md:text-base">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-xs opacity-90">
            {roleLabels[user?.role?.toLowerCase()] || "User"}
          </p>
        </div>
      </div>

      {/* Center: Nav Menu (responsive) */}
      <div className="hidden sm:flex gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveComponent(item.id)}
            className={`text-sm px-4 py-2 rounded-md transition-all ${
              activeComponent === item.id
                ? "bg-white text-indigo-600 font-semibold"
                : "hover:bg-white hover:text-indigo-600 text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Hamburger for small screens */}
      <div className="sm:hidden">
        <button onClick={() => setIsMenuOpen((prev) => !prev)}>
          <Menu className="h-6 w-6 text-white" />
        </button>
        {isMenuOpen && (
       <div className="absolute top-16 right-10 w-20 bg-white text-gray-800 shadow-lg rounded-md z-50 border border-gray-200 animate-slide-in">
       <ul className="py-1">
         {navItems.map((item) => (
           <li key={item.id}>
             <button
               onClick={() => {
                 setActiveComponent(item.id);
                 setIsMenuOpen(false);
               }}
               className={`w-full text-left px-3 py-2 text-sm rounded-md transition-all duration-150 ${
                 activeComponent === item.id
                   ? "bg-indigo-100 text-indigo-700 font-medium"
                   : "hover:bg-gray-100"
               }`}
             >
               {item.label}
             </button>
           </li>
         ))}
     
         <li>
           <hr className="my-1 border-gray-200" />
         </li>
     
         <li>
           <button
             onClick={handleLogout}
             className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-all duration-150"
           >
             Logout
           </button>
         </li>
       </ul>
     </div>
     
        )}
      </div>

      {/* Right: Logout Button (desktop) */}
      <button
        onClick={handleLogout}
        className="hidden sm:flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg"
      >
        <LogOut className="w-4 h-4 mr-1" />
        <span className="text-xs font-medium hidden sm:inline">Logout</span>
      </button>
    </div>
  );
};

export default TopNavigationBar;
