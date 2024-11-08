import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [time, setTime] = useState(0);
    const [audioUrl, setAudioUrl] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recorder, setRecorder] = useState(null);

    useEffect(() => {
        let intervalId;

        if (isRecording) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(intervalId);
            setTime(0); // Reinicia el contador cuando no está grabando
        }

        return () => clearInterval(intervalId);
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            setRecorder(mediaRecorder);
            setIsRecording(true);
            setAudioUrl(null); // Reinicia el audioURL para una nueva grabación
            const chunks = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: "audio/wav" });
                setAudioBlob(audioBlob);
                setAudioUrl(URL.createObjectURL(audioBlob)); // Habilita el botón "Enviar"
            };
            mediaRecorder.start();
        } catch (err) {
            MySwal.fire({
                title: "Permiso de Micrófono Necesario",
                text: "Por favor, activa los permisos del micrófono para poder grabar audio.",
                icon: "warning",
                confirmButtonText: "Lo acepto",
                confirmButtonColor: "#3085d6",
            });
            console.error("Error al obtener permisos de micrófono: ", err);
        }
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (recorder) {
            recorder.stop();
        }
    };

    const handleSend = () => {
        // Aquí puedes manejar el envío del audio
        console.log("Audio enviado");
    };

    return (
        <div className="audio-recorder flex flex-row items-center space-y-4 ml-4">
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-4 py-4 rounded-full flex items-center justify-center ${isRecording ? "bg-red-500" : "bg-green-500"
                    } text-white`}
            >
                <div
                    className="w-3 h-3 rounded-full bg-white"
                ></div>
            </button>

            {/* Temporizador */}
            {isRecording && (
                <div className="timer text-lg font-bold pb-4 px-3 flex flex-row  align-text-bottom items-center">
                    {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
                </div>
            )}

            {/* Botón de Enviar activado solo cuando hay una grabación */}
            <button
                onClick={handleSend}
                disabled={!audioUrl}
                className={`px-4 py-2 rounded ${audioUrl ? "bg-blue-500" : "bg-gray-300"
                    } text-white`}
            >
                Enviar
            </button>
        </div>
    );
}

export default AudioRecorder;
