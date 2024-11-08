'use client';
import React, { useState, useEffect } from "react";
import LikeButton from '@/components/LikeButton';
import Image from "next/image";
import { useSession } from 'next-auth/react';

function SCMessage({ text, sender, id, image_url, profileUrl, comment }) {
    const { data: session } = useSession();
    const isUser = sender === 'user';

    const { username, major, date } = sender;
    const [profileImage, setProfileImage] = useState('/uploads/default.png'); // Inicializar con imagen por defecto



    // Estado para las respuestas, el formulario de entrada y visibilidad de respuestas
    const [replies, setReplies] = useState(comment.replies || []);
    const [replyText, setReplyText] = useState('');
    const [showReplies, setShowReplies] = useState(false);

    // Maneja el envío de una nueva respuesta
    const handleAddReply = () => {
        if (replyText.trim()) {
            const newReply = {
                id: replies.length + 1,
                author: 'Tú',
                text: replyText,
                createdAt: new Date().toLocaleString(),
            };
            setReplies([...replies, newReply]);
            setReplyText('');
        }
    };



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
            <div className="flex items-start pt-5 mb-2">
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



            <button
                className="text-blue-500 mt-2 text-sm text-left"
                onClick={() => setShowReplies(!showReplies)}
            >
                {showReplies ? 'Ocultar respuestas' : 'Ver respuestas'}
            </button>

            {/* Respuestas */}
            {showReplies && (
                <div className="mt-4 ml-6">
                    {replies.map((reply) => (
                        <div key={reply.id} className="flex items-start mb-3">
                            <img
                                src={reply.authorAvatar || '/default-avatar.png'} // Usa la imagen personalizada si existe
                                alt={reply.author}
                                className="w-8 h-8 rounded-full mr-3"
                            />
                            <div>
                                <p className="font-bold text-sm">{reply.author}</p>
                                <p className="text-sm">{reply.text}</p>
                                <p className="text-xs text-gray-500">{reply.createdAt}</p>
                            </div>
                        </div>
                    ))}

                    {/* Formulario para agregar una respuesta */}
                    <div className="flex items-center mt-3">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Escribe una respuesta..."
                            className="flex-1 border rounded-lg px-3 py-2 text-sm mr-2"
                        />
                        <button
                            onClick={handleAddReply}
                            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg"
                        >
                            Responder
                        </button>
                    </div>
                </div>
            )}



            {/* Mostrar el contenido si es una imagen o audio */}
            {image_url && image_url !== '' && (
                <>
                    {/* Intentamos cargar la imagen, si falla, cargamos el audio */}
                    {image_url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                        <Image
                            src={image_url} // Mostrar image_url si es una imagen
                            alt="Contenido de la imagen"
                            width={200}
                            height={200}
                            className=""
                        />
                    ) : image_url.match(/\.(mp3|wav|ogg)$/i) ? (
                        <audio controls>
                            <source src={image_url} type="audio/mpeg" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    ) : null}
                </>
            )}

            <LikeButton messageId={id} username={username} />
        </div>
    );
}

export default SCMessage;
