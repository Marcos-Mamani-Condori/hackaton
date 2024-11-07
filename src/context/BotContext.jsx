'use client'; // Asegúrate de agregar esta línea para que el contexto se pueda utilizar en el lado del cliente.

import React, { useState, createContext, useEffect } from 'react';
import { sendMessageBot } from '@/app/services/api'; // Asegúrate de que esta ruta sea correcta

const BotContext = createContext();

const BotProvider = ({ children }) => {
    const [isSending, setIsSending] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [filePath, setfilePath] = useState(null); // Estado para fileIndex
    useEffect(() => {
        console.log("Valor de filePath actualizado en global:", filePath);
    }, [filePath]);
    const handleSend = () => {
        if (input.trim()) {
            const userMsg = {
                id: messages.length + 1,
                text: input,
                sender: "user",
            };
            setMessages([...messages, userMsg]);
            setInput("");
            setIsSending(true);
        }
        sendMessageBot(input)
            .then((serverResponse) => {
                const serverMsg = {
                    id: messages.length + 2,
                    text: serverResponse,
                    sender: "server",
                };
                setMessages(prevMessages => [...prevMessages, serverMsg]);
            })
            .catch((error) => {
                console.error('Error:', error);
                const serverMsg = {
                    id: messages.length + 2,
                    text: 'Error: No se pudo obtener respuesta del servidor',
                    sender: "server",
                };
                setMessages(prevMessages => [...prevMessages, serverMsg]);
            })
            .finally(() => {
                setIsSending(false);
            });
    };

    const data = { messages, isSending, handleSend, setInput, input, filePath,
        setfilePath, };

    return (
        <BotContext.Provider value={data}>
            {children}
        </BotContext.Provider>
    );
};

export { BotProvider };
export default BotContext;
