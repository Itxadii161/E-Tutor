import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";

const WelcomeMessage = () => {
  const { user, role } = useContext(UserContext);

  if (!user) return null;

  const message =
    role === "tutor"
      ? `Welcome back, ${user?.firstName}!\nReady for your next session?`
      : `Hello ${user?.firstName},\nready to become a tutor?`;

  const [showMessage, setShowMessage] = useState(false);
  const [textOffset, setTextOffset] = useState(0);

  useEffect(() => {
    setShowMessage(true); // Trigger animation on mount
    const interval = setInterval(() => {
      setTextOffset((prevOffset) => prevOffset + 1.2);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full">
      <div
        className={`transition-all duration-700 ease-out transform ${
          showMessage ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-10"
        } flex items-center justify-center bg-gradient-to-r from-blue-500 to-orange-400 text-white px-6 py-12 rounded-3xl shadow-xl w-full h-[28vh] sm:h-[30vh] md:h-[32vh] lg:h-[35vh] xl:h-[36vh] mt-6 mx-auto opacity-95`}
      >
        <div className="text-center max-w-4xl w-full -mt-4">
          <h2
            className={`whitespace-pre-line font-extrabold leading-snug text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-orange-400 
            custom-small:text-lg text-3xl sm:text-4xl md:text-5xl lg:text-6xl`}
          >
            {message}
          </h2>
        </div>
      </div>

      {/* Scrolling text */}
      <div className="absolute bottom-4 left-0 right-0 text-center w-full overflow-hidden">
        <p
          style={{
            transform: `translateX(-${textOffset}px)`,
            transition: "transform 0.1s linear",
            fontSize: "1.2rem",
            fontWeight: "600",
            opacity: 0.9,
            textAlign: "center",
            color: "transparent",
            backgroundClip: "text",
            backgroundImage: "linear-gradient(to right, #3B82F6, #F97316)",
          }}
          className="tracking-wider whitespace-nowrap"
        >
          🌟 Explore new learning paths. It's your time to shine! 🌟 ...And more exciting things ahead!
        </p>
      </div>
    </div>
  );
};

export default WelcomeMessage;
