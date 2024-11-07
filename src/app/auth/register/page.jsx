'use client';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
const inputBaseStyles=()=> {
  return "p-3 rounded block mb-2 bg-slate-900 text-slate-300";
}
const labelBaseStyles=()=> {
  return "text-slate-500 mb-2 block text-sm";
}
function RegisterPage({ onClose, setIsLoged, toggleLoginRegister }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return alert("Las contraseñas no coinciden");
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        major: data.major,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      alert("Registro exitoso");
      onClose();
    } else {
      const errorData = await res.json();
      console.error("Error en el registro:", errorData.message);
      setError(errorData.message); 
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
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Registrarse</h1>

        <form onSubmit={onSubmit} className="flex flex-col">
          <label htmlFor="username" className={labelBaseStyles()}>
            Nombre de usuario:
          </label>
          <input
            type="text"
            {...register("name", {
              required: {
                value: true,
                message: "Nombre es requerido",
              },
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 letras",
              },
            })}
            className={inputBaseStyles()}
            placeholder="Ej: Juan Perez"
          />
          {errors.name && (
            <span className="text-red-500 text-xs mb-2">{errors.name.message}</span>
          )}

          <label htmlFor="email" className={labelBaseStyles()}>
            Correo:
          </label>
          <input
            type="email"
            {...register("email", {
              required: {
                value: true,
                message: "Email es requerido  ",
              },
            })}
            className={inputBaseStyles()}
            placeholder="Ej: user@gmail.com"
          />
          {errors.email && (
            <span className="text-red-500 text-xs mb-2">{errors.email.message}</span>
          )}

          <label htmlFor="password" className={labelBaseStyles()}>
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
            <span className="text-red-500 text-sm mb-2">{errors.password.message}</span>
          )}

          <label htmlFor="confirmPassword" className={labelBaseStyles()}>
            Repita Contraseña:
          </label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "Confirmar contraseña es requerido",
              },
              minLength: {
                value: 4,
                message: "La contraseña debe tener al menos 4 letras",
              },
            })}
            className={inputBaseStyles()}
            placeholder="********"
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm mb-2">{errors.confirmPassword.message}</span>
          )}
          <label htmlFor="carrera" className={labelBaseStyles()}>
            Carrera:
          </label>
          <select
            {...register("major", {
              required: {
                value: true,
                message: "Carrera es requerido",
              },
            })}
            className={inputBaseStyles()}
          >
            <option value="">Selecciona tu carrera</option>
            {[
              'Adm. Empresas',
              'Ing. Comercial',
              'Ing. Financiera',
              'Derecho',
              'Comunicación',
              'Ing. Civil',
              'Ing. Industrial',
              'Ing. Sistemas',
              'Ing. Mecánica',
              'Ing. Electrónica',
              'Ing. Ambiental',
              'Gastronomía',
              'Veterinaria',
            ].map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
          {errors.major && (
            <span className="text-red-500 text-sm mb-2">{errors.major.message}</span>
          )}
          
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
            Registrar
          </button>
        </form>

        <button
          onClick={() => {
            toggleLoginRegister(); 
          }}
          className="w-full p-3 text-blue-600 hover:text-blue-700 mt-4"
        >
          ¿Ya tienes cuenta? Inicia Sesión
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
