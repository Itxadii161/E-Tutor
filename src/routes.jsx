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
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomePage />} />
      <Route path="signup-page" element={<SignupPage />} />
      <Route path="login" element={<Login />} />
      <Route path="become-tutor-form" element={<BecomeTutorForm />} />
      <Route
        path="dashboard"
        element={
          <PrivateRoutes>
            <Dashboard />
          </PrivateRoutes>
        }
      />
      <Route path="find-tutors" element={<FindTutorPage />} />  {/* Add Find Tutor Route */}
      <Route path="/tutorprofile/:tutorId" element={ <TutorProfile/>}/>
    </Route>
  )
);

export default router;
