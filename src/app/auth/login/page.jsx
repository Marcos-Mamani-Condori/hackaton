// pages/login.js
import React from 'react';

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-white text-3xl mb-4">Iniciar Sesión</h1>
        <button 
          onClick={() => window.location.href = 'http://localhost:3000/login'}
          className="bg-blue-500 text-white p-3 rounded-lg"
        >
          Iniciar sesión con Ciudadanía Digital
        </button>
      </div>
    </div>
  );
};

export default Login;
