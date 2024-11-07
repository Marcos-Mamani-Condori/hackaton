'use client';
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react"; // Importa useSession
import { useRouter } from "next/navigation";
import { useState } from "react";
import Warning from '@/components/Warning'; 
const inputBaseStyles=()=> {
  return "p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full";
}
const LoginPage = ({ onClose, setIsLoged, toggleLoginRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);
  const { data: session } = useSession(); 

  const onSubmit = handleSubmit(async (data) => {
    console.log("Datos enviados:", data); // Verificar qué datos se están enviando

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    console.log("Respuesta de signIn:", res); // Verificar la respuesta de la autenticación

    if (res.error) {
      console.log('Error al iniciar sesión:', res.error); 
      setError(res.error);
    } else {
      console.log('Inicio de sesión exitoso'); 
      setIsLoged(true); 
      router.push('/'); 
      onClose(); 
    }
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          className="text-gray-500 hover:text-gray-700 float-right text-2xl"
          onClick={onClose} 
        >
          ×
        </button>
        {error && ( 
          <p className="bg-red-500 text-lg text-white p-3 rounded">{error}</p>
        )}
        <h1 className="text-slate-200 font-bold text-4xl mb-4">LoyoApp</h1>
        <form onSubmit={onSubmit}> 
          <label htmlFor="nombre" className="text-slate-500 mb-2 block text-sm">
            Correo:
          </label>
          <input
            type="email"
            {...register("email", {
              required: {
                value: true,
                message: "Correo es requerido",
              }
  
            })}
            className={inputBaseStyles()}
            placeholder="Ej: user@gmail.com"
          />
          {errors.email && ( 
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}

          <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
            Contraseña:
          </label>
          <input
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Contraseña es requerido",
              },
              minLength: {
                value: 4,
                message: "La contraseña debe tener al menos 4 letras",
              },
            })}
            className={inputBaseStyles()}
            placeholder="********"
          />
          {errors.password && ( 
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
          <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
            Iniciar sesión
          </button>
        </form>

        <button
          onClick={() => {
            toggleLoginRegister(); 
          }}
          className="w-full p-3 text-blue-600 hover:text-blue-700 mt-4"
        >
          ¿No tienes cuenta? Regístrate
        </button>

        {!session && <Warning message="Necesitas estar registrado para usar el chat global" />}
      </div>
    </div>
  );
};

export default LoginPage;
