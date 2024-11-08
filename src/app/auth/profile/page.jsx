'use client';
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Para redirección
import Image from "next/image";
import ImageUploader from '@/components/ImageUploader';

const inputBaseStyles = () => {
  return "p-2 mb-4 rounded bg-gray-700 text-slate-100";
};

const labelBaseStyles = () => {
  return "text-slate-500 mb-2 block text-sm";
};

function ProfilePage({ onClose }) {
  const { data: session, status } = useSession();
  const router = useRouter(); // Inicializar router

  // Si está cargando, muestra un mensaje de carga
  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  // Si no hay sesión activa, redirige al login
  if (!session) {
    router.push('/auth/login');
    return null; // Retorna null mientras redirige
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
  });
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [filePath, setFilePath] = useState(null); // Estado para la ruta del archivo subido

  const userId = session?.user?.id;
  const userImagePath = `/uploads/${userId}.webp`;
  const defaultImagePath = '/uploads/default.png';
  const [profileImage, setProfileImage] = useState(defaultImagePath);

  useEffect(() => {
    const checkImage = async () => {
      if (userId) {
        const response = await fetch(`${userImagePath}?${Date.now()}`, { method: 'HEAD' });
        if (response.ok) {
          setProfileImage(`${userImagePath}?${Date.now()}`);
        } else {
          setProfileImage(defaultImagePath);
        }
      } else {
        setProfileImage(defaultImagePath);
      }
    };

    checkImage();
  }, [userId, showUpload]); // Actualiza cuando showUpload cambia

  const onSubmit = handleSubmit(async (data) => {
    const body = {
      name: isEditingName ? data.name : session.user.name,
      oldEmail: session.user.email,
      newEmail: isEditingEmail ? data.email : session.user.email,
      password: isEditingPassword ? data.password : null,
    };
  
    // Solo añadir profile_picture_url si filePath no es null
    if (filePath) {
      body.profile_picture_url = filePath;
    }
  
    const res = await fetch("/api/auth/put", {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (res.ok) {
      alert("Perfil actualizado con éxito");
      onClose();
    } else {
      const errorData = await res.json();
      console.error("Error al actualizar el perfil:", errorData.message);
      setError(errorData.message);
    }
  });
  
  useEffect(() => {
    if (filePath) {
      const data = {
        name: isEditingName ? getValues("name") : session.user.name,
        oldEmail: session.user.email,
        newEmail: isEditingEmail ? getValues("email") : session.user.email,
        password: isEditingPassword ? getValues("password") : null,
        profile_picture_url: filePath, // Usar el filePath
      };
      onSubmit(data); // Llama a onSubmit con los datos
    }
  }, [filePath]);

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
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Personalizar Perfil</h1>
        
        {/* Mostrar imagen de perfil */}
        <div className="flex justify-center mb-4">
          <Image
            src={profileImage}
            alt="Imagen de Perfil"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowUpload(!showUpload)}
          className="bg-blue-500 text-white p-2 rounded mb-4"
        >
          {showUpload ? "Cancelar Cambiar Imagen" : "Cambiar Imagen de Perfil"}
        </button>

        {showUpload && <ImageUploader setFilePath={setFilePath} inputSource="inputProfile" />}
        <form onSubmit={onSubmit} className="flex flex-col">
          {/* El resto de tu formulario */}
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
