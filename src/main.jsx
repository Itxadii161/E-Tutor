import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';
import './index.css';
import UserProvider from "./context/UserContext"; // import the provider


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <UserProvider> */}
      <App />
    {/* </UserProvider> */}
  </React.StrictMode>,
);