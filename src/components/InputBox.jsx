'use client';

import React, { useContext, useEffect, useState } from "react";
import BotContext from "@/context/BotContext";
import { useInputFocus } from "@/context/InputFocusContext";
import ChatGlobalContext from "@/context/ChatGlobalContext";
import { usePathname } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import { useSession } from 'next-auth/react';
import useSpeechRecognition from "./hook/useSpeechRecognition"; // Importar el hook
import InputRecorder from '@/components/InputRecorder';

function InputBox({ className }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    
    // Contextos para los diferentes casos
    const botContext = useContext(BotContext);
    const chatContext = useContext(ChatGlobalContext);
    const inputSource = pathname === "/bot" ? "inputBot" : "inputChat"; // Determina el source

    const { setInput, input, isSending, handleSend, setfilePath } = pathname === "/bot" ? botContext : chatContext;
    const { inputRef } = useInputFocus();

    const [filePath, setFilePathState] = useState(''); 
    const [file, setFile] = useState(null);

    // Usando el hook de reconocimiento de voz
    const {
        text, 
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport
    } = useSpeechRecognition(); // Usar el hook de voz

    useEffect(() => {
        if (inputRef.current && !isSending) {
            inputRef.current.focus();
        }
    }, [isSending, inputRef]);

    const setfilePathSafe = pathname === "/bot" ? () => {} : setfilePath;

    useEffect(() => {
        setfilePathSafe(filePath);
        console.log("Valor de filePath pasado en input:", filePath);
    }, [filePath, setfilePathSafe]);
    useEffect(() => {
        if (text) {
            setInput(text); // Actualizar el input con la transcripción de voz
        }
    }, [text, setInput]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Enviando input:", input);
        console.log("Ruta de archivo:", filePath);

        if (input.trim()) {
            let targetContext;

            if (pathname === "/bot") {
                targetContext = botContext;
                targetContext.handleSend(input.trim()); // Enviar el mensaje al bot
                console.log("Mensaje enviado al bot:", { text: input.trim() });
                setInput(''); // Limpiar el input después de enviar
            } else if (pathname === "/chat" && input.includes("@bolibot:")) {
                console.log("Detectado @bolibot: en /chat con input:", input);
                
                const chatInput = chatContext.input.trim();
                if (chatInput) {
                    botContext.setInput(chatInput);
                    console.log("Mensaje enviado al bot desde /chat:", { text: chatInput });
                    chatContext.setInput(''); 
                } else {
                    console.log("El input en /chat está vacío, no se enviará.");
                }
            } else {
                // Enviar al chat global
                targetContext = chatContext;
                targetContext.handleSend(input, filePath);
                console.log("Mensaje enviado al chat:", { text: input, img: filePath });
                setInput(''); 
                setFilePathState(''); 
                setFile(null); 
            }
        } else {
            console.log("El input está vacío, no se enviará.");
        }
    };
    const { listen, stop } = useSpeechRecognition({
        onResult: (result) => {
            setInput(result);
        },
    });

    ////////////////////
    // Iniciar o detener la grabación de voz
    const toggleListening = () => {
        if (browserSupportsSpeechRecognition) {
            if (isRecording) {
                SpeechRecognition.stopListening(); // Detener la grabación
                setIsRecording(false);
            } else {
                SpeechRecognition.startListening({ continuous: true, language: 'es-ES' }); // Iniciar la grabación
                setIsRecording(true);
            }
        } else {
            alert("Tu navegador no soporta el reconocimiento de voz.");
        }
    };

    /////////////////////


    return (
        <div>
            {file && (
                <div className="flex items-center mb-2">
                    {file.type.startsWith("image/") && (
                        <Image
                            src={URL.createObjectURL(file)}
                            alt="Previsualización"
                            className="object-cover rounded mr-2"
                            width={64}
                            height={64}
                        />
                    )}
                    {file.type.startsWith("audio/") && (
                        <audio controls className="mr-2">
                            <source src={URL.createObjectURL(file)} type={file.type} />
                            Tu navegador no soporta la reproducción de audio.
                        </audio>
                    )}
                    <span className="text-gray-700">{file.name}</span>
                </div>
            )}
            <form className={`${className} flex items-center justify-center`} onSubmit={handleSubmit}>
                <textarea
                    ref={inputRef}
                    value={input} // Usa directamente el input
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isSending ? "Esperando respuesta..." : "Escribe un mensaje..."}
                    disabled={isSending}
                    rows={1}
                    className="flex-1 px-4 py-2 border border-gray-600 rounded focus:outline-none focus:ring focus:border-blue-300 resize-none"
                />
                
                {pathname === '/chat' && (
                    <>
                    <ImageUploader setFilePath={setFilePathState} file={file} setFile={setFile} inputSource={inputSource} />

                       <InputRecorder  setFilePath={setFilePathState} file={file} setFile={setFile}/>
                    </>

                    
                )}
                
                
                <button
                    type="submit"
                    disabled={isSending}
                    className={`text-white px-4 ml-2 py-2 rounded ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    Enviar
                </button>

                {pathname === '/bot' && hasRecognitionSupport && (
                    <button
                        type="button"
                        className={`text-white px-4 ml-2 py-2 rounded ${isListening ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                        onMouseDown={startListening}
                        onMouseUp={stopListening}
                    >
                        🎤
                    </button>
                )}
            </form>
        </div>
    );
}

export default InputBox;
