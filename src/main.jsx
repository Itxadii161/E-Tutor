import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import App from './App';
import './index.css';
import UserProvider from "./context/UserContext"; // import the provider


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);