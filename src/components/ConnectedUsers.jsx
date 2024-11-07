// pages/connectedUsers.js
'use client';
import React, { useEffect, useState } from 'react';

const ConnectedUsers = () => {
    const [connectedUsers, setConnectedUsers] = useState(0);

    useEffect(() => {
        const fetchConnectedUsers = async () => {
            try {
                const response = await fetch('/api/connected-users');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("Datos recibidos:", data);
                setConnectedUsers(data.connectedUsers);
            } catch (error) {
                console.error("Error al obtener el conteo de usuarios:", error);
            }
        };

        fetchConnectedUsers();
    }, []);

    return (
        <div>
            <h2>Usuarios conectados: {connectedUsers}</h2>
        </div>
    );
};

export default ConnectedUsers;
