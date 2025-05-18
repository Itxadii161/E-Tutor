import React from "react";
import ScrollToTop from './components/SMALL_components/ScrollToTop';
import ProfessionalNavbar from "./components/HomePageComp/ProfessionalNavbar";
import Footer from './components/HomePageComp/Footer';
import { Outlet } from "react-router-dom"; // for nested routes

function App() {
  return (
    <div className="bg-white min-h-screen font-sans">
      <ScrollToTop />
      <ProfessionalNavbar/>
      {/* <Navbar /> */}
      <Outlet /> {/* This renders your nested routes */}
      <Footer />
    </div>
  );
}

export default App;
