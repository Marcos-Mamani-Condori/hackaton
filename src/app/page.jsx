'use client';

import UsersCounter from "@/components/UsersCounter";
import Announcements from "@/components/Announcements";
import { useState } from "react";

import ActivityCalendar from "@/components/ActivityCalendar";


import CommentReply from '@/components/ComentReply';


const activities = [
    { day: "20", month: "Oct", title: "primer evento" },
    { day: "28", month: "Oct", title: "segundo evento" },
    { day: "02", month: "Nov", title: "tercer evento" },
    { day: "04", month: "Nov", title: "cuarto evento" },
    { day: "25", month: "Nov", title: "quinto evento" },
];


const comment = {
    author: 'Juan Pérez',
    authorAvatar: '/default-avatar.png',  // Puedes cambiar la URL del avatar
    text: 'Este es un comentario de ejemplo.',
    createdAt: 'Hace 1 horas',
    replies: [
        {
            id: 1,
            author: 'Ana Gómez',
            authorAvatar: '@/app/ana-avatar.png', // Imagen personalizada de Ana
            text: '¡Estoy de acuerdo con tu comentario!',
            createdAt: 'Hace 21 minutos ',
        },
        {
            id: 2,
            author: 'Carlos Ruiz',
            authorAvatar: '/carlos-avatar.png', // Imagen personalizada de Carlos
            text: 'Buena observación.',
            createdAt: 'Hace 19 minutos',
        },
    ],
};


const Home = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="overflow-y-auto h-lvh mt-4">
            <Announcements
                isModalOpen={isModalOpen}
                setModalOpen={setIsModalOpen}
            />

            <div className="flex flex-col md:flex-row py-5 md:mx-10 lg:mx-[10rem] space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 max-h-[477px] overflow-y-auto w-full">
                    <UsersCounter />
                </div>

                <div className="flex-1 w-full">
                    <ActivityCalendar activities={activities} />
                </div>
            </div>



            <br /><br /><br />
            <br /><br /><br />
            <br /><br /><br />
        </div>

    );
}

export default Home;