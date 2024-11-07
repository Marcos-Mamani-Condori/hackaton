'use client';
import React from "react";
import { useSession } from 'next-auth/react';
import imageicon from '@/public/static/more.png';
const ImageUploader = ({ setFilePath, file, setFile, inputSource }) => { 
    const { data: session } = useSession();

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if(inputSource=="inputChat" || inputSource=="inputBot")
        {setFile(selectedFile);}
        if (selectedFile) {
            console.log("Archivo seleccionado:", selectedFile);
            const uploadedFilePath = await handleUpload(selectedFile); 
            if (uploadedFilePath) {
                console.log("Ruta del archivo devuelta:", uploadedFilePath);
                setFilePath(uploadedFilePath);
            } else {
                console.error("Error al obtener la ruta del archivo.");
            }
        }
    };
    const handleUpload = async (selectedFile) => { // Agrega inputSource como parámetro
        if (!selectedFile) {
            console.error('No se ha seleccionado ningún archivo.');
            return null;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('inputSource', inputSource); // Envía inputSource a la API
        console.log('Preparando para subir el archivo source :', inputSource);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Imagen subida correctamente:', data);
                return data.filePath; 
            } else {
                console.error('Error al subir la imagen:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            return null;
        }
    };

    return (
        <div>
            <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden"
                id="file-upload"
            />
             <img 
                src={imageicon.src} 
                alt="Seleccionar imagen" 
                onClick={() => document.getElementById('file-upload').click()}
                className="cursor-pointer"
                style={{ width: '50px', height: '50px' }} // Ajusta el tamaño según sea necesario
            />
            {/* Ya no necesitas mostrar la previsualización aquí */}
        </div>
    );
};

export default ImageUploader;
