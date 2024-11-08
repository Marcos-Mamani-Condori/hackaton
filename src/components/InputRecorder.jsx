'use client';
import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function InputRecorder({ setFilePath, file, setFile }) { 
    const { data: session } = useSession();
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [time, setTime] = useState(0);
    const [recorder, setRecorder] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null); // Para la previsualización de audio

    useEffect(() => {
        let intervalId;

        if (isRecording && !isPaused) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isRecording, isPaused]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            setRecorder(mediaRecorder);
            setIsRecording(true);
            setTime(0);
            
            const chunks = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: "audio/wav" });
                setFile(audioBlob); // Guarda el archivo en el estado file
                const audioUrl = URL.createObjectURL(audioBlob); // Genera la URL para previsualización
                setAudioUrl(audioUrl);
                await handleUpload(audioBlob); // Sube el archivo
            };

            mediaRecorder.start();
        } catch (err) {
            MySwal.fire({
                title: "Permiso de Micrófono Necesario",
                text: "Por favor, activa los permisos del micrófono para grabar audio.",
                icon: "warning",
                confirmButtonText: "Lo acepto",
                confirmButtonColor: "#3085d6",
            });
            console.error("Error al obtener permisos de micrófono:", err);
        }
    };

    const pauseRecording = () => {
        if (recorder && recorder.state === "recording") {
            recorder.pause();
            setIsPaused(true);
        } else if (recorder && recorder.state === "paused") {
            recorder.resume();
            setIsPaused(false);
        }
    };

    const stopRecording = () => {
        if (recorder) {
            setIsRecording(false);
            setIsPaused(false);
            recorder.stop();
        }
    };

    const handleUpload = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('inputSource', "audio");

        try {
            const response = await fetch('/api/upload-audio', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Audio subido correctamente:", data);
                setFilePath(data.filePath); // Almacena la ruta en el estado global
            } else {
                console.error("Error al subir el audio:", data.error);
            }
        } catch (error) {
            console.error("Error al subir el audio:", error);
        }
    };

    return (
        <div className="audio-uploader flex items-center space-x-4">
            {/* Botón de grabación/pausa */}
            <button
                onClick={isRecording ? pauseRecording : startRecording}
                className={`px-2 py-2 rounded-full ${isRecording ? "bg-yellow-500" : "bg-green-500"} text-white`}
            >
                {isRecording && !isPaused ? "⏸" : isPaused ? "▶" : "Grabar"}
            </button>

            {/* Temporizador */}
            {isRecording && (
                <>
                <div className="timer">
                    {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
                </div>
                {/* Botón de finalizar */}
            <button
                onClick={stopRecording}
                disabled={!isRecording}
                className="px-2 py-2 rounded bg-red-500 text-white"
            >
                🟥
            </button>
            </>
            )}

            

            {/* Reproductor de audio para previsualización */}
         
        </div>
    );
}

export default InputRecorder;
