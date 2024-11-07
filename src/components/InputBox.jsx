'use client';

import React, { useContext, useEffect, useState } from "react";
import BotContext from "@/context/BotContext";
import { useInputFocus } from "@/context/InputFocusContext";
import ChatGlobalContext from "@/context/ChatGlobalContext";
import { usePathname } from 'next/navigation'; 
import ImageUploader from '@/components/ImageUploader';
import { useSession } from 'next-auth/react';
import { useSpeechRecognition } from "react-speech-kit";
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

    useEffect(() => {
        if (inputRef.current && !isSending) {
            inputRef.current.focus();
        }
    }, [isSending, inputRef]);

    useEffect(() => {
        if (pathname !== "/bot" && typeof setfilePath === "function") {
            setfilePath(filePath);
            console.log("Valor de filePath pasado en input:", filePath);
        }
    }, [filePath, pathname, setfilePath]);

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
                // Si estamos en la ruta /bot, enviamos al contexto del bot
                targetContext = botContext;
                targetContext.handleSend(input.trim()); // Enviar el mensaje al bot
                console.log("Mensaje enviado al bot:", { text: input.trim() });

            } else if (pathname === "/chat" && input.includes("@bolibot:")) {
                // Enviar el mensaje solo al bot desde /chat
                console.log("Detectado @bolibot: en /chat con input:", input);
                
                // Usamos el valor de `input` directamente desde el `chatContext`
                const chatInput = chatContext.input.trim();
            
                if (chatInput) {

                    // Actualizamos el input en botContext y enviamos el mensaje
                    botContext.setInput(chatInput);
                    console.log("Mensaje enviado al bot desde /chat:", { text: chatInput });

                    // Limpiar el input en el chatContext después de enviar
                    chatContext.setInput(''); 
                } else {
                    console.log("El input en /chat está vacío, no se enviará.");
                }
            } else {
                // En cualquier otro caso, enviamos al chat global
                targetContext = chatContext;
                targetContext.handleSend(input, filePath);
                console.log("Mensaje enviado al chat:", { text: input, img: filePath });
                setInput('');
                setFilePathState(''); // Limpiar filePath
                setFile(null); // Limpiar el archivo
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

    return (
        <div>
            {file && (
                <div className="flex items-center mb-2">
                    <image src={URL.createObjectURL(file)} alt="Previsualización" className="w-16 h-16 object-cover rounded mr-2" />
                    <span className="text-gray-700">{file.name}</span>
                </div>
            )}
            <form className={`${className} flex items-center justify-center`} onSubmit={handleSubmit}>
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    placeholder={isSending ? "Esperando respuesta..." : "Escribe un mensaje..."}
                    disabled={isSending}
                    rows={1}
                    className="flex-1 px-4 py-2 border border-gray-600 rounded focus:outline-none focus:ring focus:border-blue-300 resize-none"
                />
                
                {session && session.user.role === 'premium' && pathname !== "/bot" && (
                    // Muestra el cargador de imágenes solo si inputSource es inputChat
                    <ImageUploader setFilePath={setFilePathState} file={file} setFile={setFile} inputSource={inputSource} />
                )}
                
                <button
                    type="submit"
                    disabled={isSending}
                    className={`text-white px-4 ml-2 py-2 rounded ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    Enviar
                </button>
                {pathname === '/chat' && (
                   <>
                                   <InputRecorder />
              
                   </>
                )}
                {pathname === '/bot' && (
                    <button
                        type="button"
                        className={`text-white px-4 ml-2 py-2 rounded bg-blue-500 hover:bg-blue-600`}
                        onClick={listen}
                        onMouseLeave={stop}
                    >
                        🎤
                    </button>
                )}
            </form>
        </div>
    );
}

export default InputBox;
