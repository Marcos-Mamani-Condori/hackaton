'use client'; // Asegúrate de agregar esta línea para que el contexto se pueda utilizar en el lado del cliente.

import React, { createContext, useContext, useEffect, useState } from 'react';

// Crear el contexto
const DeviceContext = createContext();

// Proveedor del contexto
const DeviceProvider = ({ children }) => {
    const [deviceType, setDeviceType] = useState('PC');

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
        // Detectar dispositivos móviles y PC
        if (/android/i.test(userAgent) || 
            (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) || 
            (/Windows/.test(userAgent) && 'ontouchstart' in window)) {
            setDeviceType('Mobile');
        } else {
            setDeviceType('PC');
        }
    }, []); 
    
    const data = { deviceType };

    return (
        <DeviceContext.Provider value={data}>
            {children}
        </DeviceContext.Provider>
    );
};

// Hook para usar el contexto
const useDevice = () => useContext(DeviceContext);

export { DeviceProvider, useDevice };
export default DeviceContext;
