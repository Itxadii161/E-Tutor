import React from 'react';
import ScrollToTop from './components/SMALL_components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NavMenu from './components/Nav_Menu';
import BecomeTutorForm from './components/BecomeTutorForm'
import HomePage from './pages/Homepage'
import SignupPage from './pages/SignupPage'
import SignInPage from './pages/SignInPage'
import Dashboard from './pages/Dashboard-page';
// import Overview from './components/Dashboard-Component/Overview';
function App() {
  return (
    <Router>
    <div className="bg-white min-h-screen font-sans">
    <ScrollToTop />
      <NavMenu/>
      <Navbar />
      <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/become-tutor-form" element={<BecomeTutorForm />} />
          <Route path='/signup-page' element={<SignupPage/>} />
          <Route path='/signin-page' element={<SignInPage/>} />
          <Route path='/dashboard-page' element={<Dashboard/>} />
          {/* <Route path="/overveiw" element={<Overview />} /> */}
        </Routes> 
      <Footer />
    </div>
    </Router>
  );
}

export default App;