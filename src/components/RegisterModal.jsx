'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import LoginPage from '@/app/auth/login/page';
import RegisterPage from '@/app/auth/register/page';
import ProfilePage from '@/app/auth/profile/page'; // Asegúrate de que la ruta sea correcta

const RegisterModal = ({ isOpen, onClose, setIsLoged }) => {
  const { data: session } = useSession(); // Obtener la sesión
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  const toggleLoginRegister = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <>
      {session ? ( // Si hay sesión, mostrar el ProfilePage
        <>
          <ProfilePage onClose={onClose} />
          {console.log("Usuario autenticado")}
        </>
      ) : isLogin ? ( // Si no hay sesión y está en login
        <LoginPage onClose={onClose} setIsLoged={setIsLoged} toggleLoginRegister={toggleLoginRegister} />
      ) : (
        <RegisterPage onClose={onClose} setIsLoged={setIsLoged} toggleLoginRegister={toggleLoginRegister} />
      )}
    </>
  );
};

export default RegisterModal;
