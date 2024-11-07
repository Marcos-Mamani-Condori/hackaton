'use client'; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Usamos el componente Link de Next.js para la navegación
import { usePathname } from 'next/navigation'; // Reemplaza useLocation
import { useDevice } from '@/context/DeviceContext';
import { useInputFocus } from '@/context/InputFocusContext';

const NavBar = ({ className }) => {
    const { deviceType } = useDevice();
    const { isInputFocused } = useInputFocus();

    // Obtener la ruta actual usando el hook de Next.js
    const pathname = usePathname();

    const [activeLink, setActiveLink] = useState(pathname); // Inicializa con la ruta actual

    const handleLinkClick = (link) => {
        setActiveLink(link); // Cambia el enlace activo al hacer clic
    };

    // Actualiza el enlace activo cuando cambia la ruta
    useEffect(() => {
        setActiveLink(pathname);
    }, [pathname]);

    return (
        <nav className={`${className} ${deviceType === 'Mobile' && isInputFocused ? 'hidden' : ''} bg-gray-200 text-white`}>
            <ul className="grid grid-cols-3 gap-4 sm:gap-0">
                <li className="flex justify-center items-center">
                    <Link href="/" onClick={() => handleLinkClick('/')}>
                        <span className={`inline-flex flex-col px-10 py-2 ${activeLink === '/' ? 'text-red-800 border-t-2 border-red-600' : 'text-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-300`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-2 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <span className={`text-sm`}>
                                Inicio
                            </span>
                        </span>
                    </Link>
                </li>
                <li className="flex justify-center items-center">
                    <Link href="/chat" onClick={() => handleLinkClick('/chat')}>
                        <span className={`inline-flex flex-col px-10 py-2 ${activeLink === '/chat' ? 'text-red-800 border-t-2 border-red-600' : 'text-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-300`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M4 4h16v12H5.17L4 17.17zm0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm2 10h8v2H6zm0-3h12v2H6zm0-3h12v2H6z" />
                            </svg>
                            <span className={`text-sm`}>
                                Chat
                            </span>
                        </span>
                    </Link>
                </li>
                <li className="flex justify-center items-center">
                    <Link href="/bot" onClick={() => handleLinkClick('/bot')}>
                        <span className={`inline-flex flex-col px-10 py-2 ${activeLink === '/bot' ? 'text-red-800 border-t-2 border-red-600' : 'text-gray-700'} hover:bg-gray-50 dark:hover:bg-gray-300`}>
                            <svg className="w-7 h-7" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3">
                                    <path d="M4 15.5a2 2 0 1 1 0-4m16 4a2 2 0 1 0 0-4M7 7V4m10 3V4" />
                                    <circle cx="7" cy="3" r="1" />
                                    <circle cx="17" cy="3" r="1" />
                                    <path d="M13.5 7h-3c-2.828 0-4.243 0-5.121.909S4.5 10.281 4.5 13.207s0 4.389.879 5.298c.878.909 2.293.909 5.121.909h1.025c.792 0 1.071.163 1.617.757c.603.657 1.537 1.534 2.382 1.738c1.201.29 1.336-.111 1.068-1.256c-.076-.326-.267-.847-.066-1.151c.113-.17.3-.212.675-.296c.591-.132 1.079-.348 1.42-.701c.879-.91.879-2.372.879-5.298s0-4.389-.879-5.298C17.743 7 16.328 7 13.5 7" />
                                    <path d="M9.5 15c.57.607 1.478 1 2.5 1s1.93-.393 2.5-1m-5.491-4H9m6.009 0H15" />
                                </g>
                            </svg>
                            <span className={`text-sm`}>
                                Bot
                            </span>
                        </span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
