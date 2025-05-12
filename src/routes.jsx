// src/routes.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "./App"; // Acts as layout
import HomePage from "./pages/Homepage";
import SignupPage from "./pages/SignupPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BecomeTutorForm from "./components/BecomeTutorForm";
import FindTutorPage from "./pages/FindTutorPage";  // Import FindTutorPage
import PrivateRoutes from "./components/PrivateRoutes"; 
import TutorProfile from './pages/TutorProfile'
import TutorCard from "./components/SMALL_components/TutorCard";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomePage />} />
      <Route path="signup-page" element={<SignupPage />} />
      <Route path="login" element={<Login />} />
      <Route path="/how-it-works" element={ <HowItWorks/>}/>
      <Route path="/about" element={ <About/>}/>

      <Route
       path="become-tutor-form"
       element={
        <PrivateRoutes> 
       <BecomeTutorForm />
       </PrivateRoutes>
        }
       />
      
      <Route
        path="dashboard"
        element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        }
      />
      <Route path="find-tutors" element={ 
          <PrivateRoutes>
        <FindTutorPage />
        </PrivateRoutes>
        } /> 
       {/* Add Find Tutor Route */}
      <Route path="/tutorprofile/:id" element={ <TutorProfile/>}/>
      <Route path="/tutors/:tutorId" element={<TutorCard />} />

    </Route>
  )
);

export default router;
