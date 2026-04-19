// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { AuthProvider } from './context/AuthContext';
import AppRoutes from "./routes/AppRoutes";
import './App.css'

function App() {
  return (
      <Router>
        
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
          />        
      </Router>
  )
}

export default App