// components/Notification.js
import { useEffect } from "react";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center`}>
      <span>{message}</span>
      <button 
        onClick={onClose} 
        className="ml-4 text-white hover:text-gray-200"
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;