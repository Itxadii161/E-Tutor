// src/routes.jsx
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router-dom";
  
  import App from "./App"; // acts as layout
  import HomePage from "./pages/Homepage";
  import SignupPage from "./pages/SignupPage";
  import Login from "./pages/Login";
  import Dashboard from "./pages/Dashboard";
  import BecomeTutorForm from "./components/BecomeTutorForm";
  import PrivateRoutes from "./components/PrivateRoutes";
  // import  GoogleLoginButton  from "./pages/GoogleLoginButton";
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        {/* <Route path="/googlelogin" element={<GoogleLoginButton/>}/> */}
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
      </Route>
    )
  );
  
  export default router;
  