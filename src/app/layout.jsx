'use client';  
import React, { useEffect } from 'react';
import "@/app/globals.css"; 
import ProvidersContext from "@/context/ProvidersContext";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import { SessionProvider } from "next-auth/react";
const useDisableScrollOnMobile = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = /Mobi|Android/i.test(window.navigator.userAgent);

      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.body.style.overflow = '';
      };
    }
  }, []);
};

export default function RootLayout({ children }) {
  useDisableScrollOnMobile(); 

  return (
    <html lang="es">
      <body>
      <SessionProvider>
        <ProvidersContext>
          <div className="grid grid-cols-12 grid-rows-10 w-full h-full fixed overflow-fixed">
            <Header className={"col-span-12 row-span-1"} />
            <div className="mx-2 md:mx-10 grid grid-rows-10 col-span-12 row-span-10">
              {children}
            </div>
            <NavBar className={"col-span-12 row-span-1"} />
          </div>
        </ProvidersContext>
        </SessionProvider>
      </body>
    </html>
  );
}
