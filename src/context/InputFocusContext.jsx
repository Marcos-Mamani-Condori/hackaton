'use client'; // Asegúrate de agregar esta línea para que el contexto se ejecute en el lado del cliente.

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'; // Importar usePathname de Next.js

// Crear el contexto
const InputFocusContext = createContext();

// Proveedor del contexto
const InputFocusProvider = ({ children }) => {
    const [isInputFocused, setIsInputFocused] = useState(false);
    const inputRef = useRef(null);
    const pathname = usePathname(); // Usa usePathname para acceder a la ubicación

    useEffect(() => {
        const handleFocus = () => { 
            setIsInputFocused(true);
        };
        const handleBlur = () => setIsInputFocused(false);

        const inputElement = inputRef.current;

        if (inputElement) {
            inputElement.addEventListener('focus', handleFocus);
            inputElement.addEventListener('blur', handleBlur);

            return () => {
                inputElement.removeEventListener('focus', handleFocus);
                inputElement.removeEventListener('blur', handleBlur);
            };
        }
    }, [pathname]); // Ejecuta el efecto cuando cambia la ruta

    return (
        <InputFocusContext.Provider value={{ isInputFocused, inputRef }}>
            {children}
        </InputFocusContext.Provider>
    );
};

// Hook para usar el contexto
const useInputFocus = () => useContext(InputFocusContext);

export { InputFocusProvider, useInputFocus };
export default InputFocusContext;
