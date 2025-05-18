import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";

const WelcomeMessage = () => {
  const { user, role } = useContext(UserContext);
  const [animatedText, setAnimatedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!user) return null;

  const isTutor = role === "tutor";
  const message = isTutor
    ? `Welcome back, ${user?.firstName}!\nReady for your next session?`
    : `Hello ${user?.firstName},\nReady to level up your learning?`;

  const fullText = isTutor
    ? "Manage your students and schedule sessions with ease."
    : "Discover expert tutors, learn at your pace, and unlock your potential.";

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setAnimatedText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <div className="relative p-6 md:p-10  bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-lg overflow-hidden">
      {/* Message Area */}
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 whitespace-pre-line leading-snug">
          {message}
        </h2>

        <p className="text-sm md:text-base text-white/90 min-h-[48px] mb-4">
          {animatedText}
          {currentIndex < fullText.length && (
            <span className="inline-block animate-ping ml-1">|</span>
          )}
        </p>

        {!isTutor && (
          <div className="mt-4">
            <button className="px-5 py-2 bg-white text-indigo-700 font-semibold rounded-lg shadow hover:bg-indigo-100 transition">
              Find a Tutor
            </button>
          </div>
        )}
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mt-10 -mr-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -mb-8 -ml-8 pointer-events-none" />

      {/* Scrolling Notification */}
      <div
        className="absolute bottom-2 left-0 w-full overflow-hidden text-xs text-white/80"
        style={{ whiteSpace: "nowrap" }}
      >
        <div
          className="inline-block"
          style={{
            animation: "scroll 15s linear infinite",
            display: "inline-block",
          }}
        >
          {Array(3).fill("🚀 New features launching soon!").join(" • ")}
        </div>
      </div>

      {/* Inline keyframes via style tag */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default WelcomeMessage;
