'use client';
import React, { useState, useEffect } from "react";
import LikeButton from '@/components/LikeButton';
import Image from "next/image";
import { useSession } from 'next-auth/react';

function SCMessage({ text, sender, id, image_url, profileUrl }) {
    const { data: session } = useSession();
    const isUser = sender === 'user';

    const { username, major, date } = sender;
    const [profileImage, setProfileImage] = useState('/uploads/default.png'); // Inicializar con imagen por defecto

    useEffect(() => {
        console.log("Profile URL: ", profileUrl);
        
        // Verificar si profileUrl es válido
        if (profileUrl && profileUrl.trim() !== 'no') {
            setProfileImage(profileUrl);
        } else {
            setProfileImage('/uploads/default.png'); // Usar imagen por defecto
        }
    }, [profileUrl]); // Solo dependemos de profileUrl

    // Para obtener la hora en que se envió el mensaje
    const obtenerTiempoTranscurrido = () => {
        const fechaComentarioDate = new Date(date);
        const fechaActual = new Date();
        const diferenciaTiempo = fechaActual - fechaComentarioDate;
        const segundos = Math.floor(diferenciaTiempo / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const días = Math.floor(horas / 24);
        const semanas = Math.floor(días / 7);
        const meses = Math.floor(días / 30);
        const años = Math.floor(días / 365);

        if (años > 0) {
            return ` hace ${años} año${años > 1 ? 's' : ''}`;
        } else if (meses > 0) {
            return ` hace ${meses} mes${meses > 1 ? 'es' : ''}`;
        } else if (semanas > 0) {
            return ` hace ${semanas} semana${semanas > 1 ? 's' : ''}`;
        } else if (días > 0) {
            return ` hace ${días} día${días > 1 ? 's' : ''}`;
        } else if (horas > 0) {
            return ` hace ${horas} hora${horas > 1 ? 's' : ''}`;
        } else if (minutos > 0) {
            return ` hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
        } else {
            return ` hace ${segundos} segundo${segundos > 1 ? 's' : ''}`;
        }
    };

    return (
        <div className={`flex flex-col ${isUser ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'} rounded-lg p-4`}>
            <div className="flex items-center mb-2">
                <Image 
                    src={profileImage} // Forzar recarga
                    alt={`${username}'s profile`}
                    width={64}
                    height={64}
                    className="rounded-full"
                />
                <div className="ml-2">
                    <span className="font-semibold text-sm">{username}</span>
                    <span className="text-xs text-gray-500">{obtenerTiempoTranscurrido()}</span>
                    <span className="block text-xs text-gray-500">{major}</span>
                </div>
            </div>
            <p className="text-sm">{text}</p>
            {image_url && image_url !== '' && (
                <Image 
                    src={image_url} // Mostrar image_url si existe
                    alt="Contenido de la imagen"
                    width={200}
                    height={200}
                    className=""
                />
            )}
            <LikeButton messageId={id} username={username} />
        </div>
    );
}

export default SCMessage;
