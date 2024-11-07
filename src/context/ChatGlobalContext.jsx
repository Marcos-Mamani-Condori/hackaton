'use client';

import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import getSocket from '@/libs/socket';
import { useSession } from 'next-auth/react';
import ModalContext from '@/context/ModalContext';

const ChatGlobalContext = createContext();

const ChatGlobalProvider = ({ children }) => {
    const [isSending, setIsSending] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]); // Mantener el estado de mensajes
    const [offset, setOffset] = useState(0); // Offset para cargar más mensajes
    const [hasMoreMessages, setHasMoreMessages] = useState(true); // Control de mensajes
    const socketRef = useRef(null); // Usamos useRef para evitar duplicados
    const { setIsRegisterModalOpen, setIsLoged } = useContext(ModalContext);
    const { data: session } = useSession();
    const [filePath, setfilePath] = useState(null); // Estado para fileIndex
    useEffect(() => {
        console.log("Valor de filePath actualizado en global:", filePath);
    }, [filePath]);
        // Inicializar el socket solo una vez
        if (!socketRef.current) {
            socketRef.current = getSocket();

            if (socketRef.current) {
            socketRef.current.on('connect', () => {
                console.log('Conexión WebSocket establecida con el ID:', socketRef.current.id);
            });

            socketRef.current.on('connect_error', (error) => {
                console.error('Error en la conexión WebSocket:', error);
            });

            socketRef.current.on('disconnect', (reason) => {
                console.warn('WebSocket desconectado:', reason);
            });

            socketRef.current.on('initial_preguntas', (data) => {
                console.log('Mensajes iniciales recibidos:', data.messages);
                setMessages(data.messages.reverse());
                setOffset(data.messages.length);
            });

            socketRef.current.on('new_pregunta', (pregunta) => {
                setMessages((prevMessages) => [...prevMessages, pregunta]);
                 // Actualizar el offset para reflejar el nuevo mensaje
            setOffset((prevOffset) => prevOffset + 1);
            });

            socketRef.current.on('more_preguntas', (data) => {
                if (data.messages && data.messages.length > 0) {
                    setMessages((prevMessages) => [...data.messages.reverse(), ...prevMessages]);
                    setOffset((prevOffset) => prevOffset + data.messages.length);
                }
                setHasMoreMessages(data.has_more);
            });

            socketRef.current.onAny((event, ...args) => {
                console.debug(`Evento recibido: ${event}`, args);
            });
        }}

    const handleSend = () => {
        console.log("Preparando para enviar...");
        console.log("Mensaje:", input);
        console.log("Ruta de archivo:", filePath);
        if (!socketRef.current || !socketRef.current.connected || !session) {
            console.error('No se puede enviar el mensaje: WebSocket no está conectado o no hay sesión.');
            setIsRegisterModalOpen(true);
            setIsLoged(false);
            return;
        }

        setIsSending(true);
        const accessToken = session?.user?.accessToken;

        if (!accessToken) {
            console.error('No se encontró el token para enviar.');
            setIsSending(false);
            return;
        }

       
        socketRef.current.emit('send_pregunta', {
            message: input,
            img: filePath,
            token: accessToken
             
        }, (response) => {
            if (response && response.error) {
                setIsRegisterModalOpen(true);
                setIsLoged(false);
                
                console.error('Error al enviar mensaje al servidor:', response.error);
            } else if (response) {
                console.log('Mensaje enviado exitosamente al chat global:', response);
            }
        });
console.log("enviadooooo" +filePath)
        setIsSending(false);
    };

    const loadMoreMessages = () => {
        if (!hasMoreMessages) {
            console.log('No hay más mensajes para cargar.');
            return;
        }

        if (!socketRef.current || !socketRef.current.connected) {
            console.error('No se puede cargar más mensajes: la conexión WebSocket no está establecida.');
            return;
        }

        socketRef.current.emit('load_more_preguntas', { offset }, (response) => {
            if (response && Array.isArray(response.messages)) {
                if (response.messages.length > 0) {
                    console.log('Más mensajes cargados:', response.messages);
                    setMessages((prevMessages) => [...response.messages.reverse(), ...prevMessages]);
                    setOffset((prevOffset) => prevOffset + response.messages.length);
                } else {
                    setHasMoreMessages(false);
                }
            } else if (response && response.error) {
                console.error('Error al recibir mensajes antiguos:', response.error);
            }
        });
    };

    const data = {
        messages,
        handleSend,
        input,
        setInput,
        isSending,
        loadMoreMessages,
        hasMoreMessages,
        offset,
        filePath,
        setfilePath,
    };

    return (
        <ChatGlobalContext.Provider value={data}>
            {children}
        </ChatGlobalContext.Provider>
    );
};

export { ChatGlobalProvider };
export default ChatGlobalContext;
