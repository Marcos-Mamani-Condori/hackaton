import { io } from 'socket.io-client';

let socket;

const getSocket = () => {
    if (!socket) {
        // Verifica si estamos en el lado del cliente
        if (typeof window !== 'undefined') {
            console.log('Inicializando nueva conexión WebSocket...');
            socket = io(`${window.origin}`);  
        } 
    }
    return socket;  
};

export default getSocket;
