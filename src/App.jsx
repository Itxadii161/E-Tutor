// src/App.jsx
import React from "react";
import ScrollToTop from './components/SMALL_components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NavMenu from './components/Nav_Menu';
import { Outlet } from "react-router-dom"; // for nested routes

function App() {
  return (
    <div className="bg-white min-h-screen font-sans">
      <ScrollToTop />
      <NavMenu />
      <Navbar />
      <Outlet /> {/* This renders your nested routes */}
      <Footer />
    </div>
  );
}

export default App;
