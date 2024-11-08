'use client';

import { useContext, useState } from 'react';
import Image from 'next/image';
import user_icon from '@/public/static/user_icon.png';
import bell_icon from '@/public/static/bell_icon.svg';
import accesibility_icon from "@/public/static/accesibility.svg";
import RegisterModal from '@/components/RegisterModal';
import { usePathname } from 'next/navigation';
import ModalContext from '@/context/ModalContext';
import AccesibilityContext from '@/context/AccesibilityContext';
import { signOut, useSession } from 'next-auth/react';

const Header = ({ className }) => {
    const { isRegisterModalOpen, setIsRegisterModalOpen, setIsLoged } = useContext(ModalContext);
    const {handleSpeak,accesibility,setAccesibility}=useContext(AccesibilityContext);
    
    const { data: session } = useSession();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false); // New state for notification box

    const handleRegisterClick = () => {
        setIsLoged(false);
        setIsRegisterModalOpen(true);
    };

    const handleCloseRegisterModal = () => {
        setIsRegisterModalOpen(false);
    };

    const toggleNotificationBox = () => {
        setIsNotificationOpen(!isNotificationOpen); // Toggle notification box visibility
    };
    

    const pathname = usePathname();
    const pageTitles = {
        "/": "BoliApp",
        "/chat": "BoliChat",
        "/bot": "BoliBot",
    };
    const currentTitle = pageTitles[pathname] || "BoliApp";

    return (
        <header className={`${className} h-full bg-gray-800 overflow-hidden flex items-center justify-center relative`}>
            <div className="absolute left-4"></div>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white">{currentTitle}</h1>
            </div>

            {/* Desktop-only section */}
            <div className="absolute left-1 hidden lg:block">
                {session && (
                    <div>
                        <span className="text-white px-3">Bienvenidos, {session.user.name}!</span>
                        <button className="bg-white text-black px-4 py-2 rounded-md" onClick={() => signOut()}>
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>

            {/* User icon */}
            <div className="absolute right-4 md:right-10">
                <button onClick={handleRegisterClick}>
                    <Image
                        src={user_icon}
                        alt="User icon"
                        width={32}
                        height={32}
                        className="h-8 w-8"
                        loading="eager"
                    />
                </button>
            </div>

            {/* Bell icon */}
            <div className="absolute right-8 md:right-20">
                <button onClick={toggleNotificationBox}> {/* Toggle notification box */}
                    <Image 
                        src={bell_icon} 
                        alt="Notification bell icon" 
                        width={32} 
                        height={32} 
                        className="h-8 w-8" 
                        loading="eager"
                    /> 
                </button>
                {isNotificationOpen && ( // Render white box if notification is open
                    <div className="absolute top-10 right-0 w-48 p-4 bg-white border border-gray-300 rounded shadow-lg">
                        <p className="text-gray-700">No new notifications</p>
                    </div>
                )}
            </div>

            <div className="absolute right-12 md:right-32">
                <button onClick={()=>setAccesibility(!accesibility)} > 
                    <Image 
                        src={accesibility_icon} 
                        alt="Notification bell icon" 
                        width={32} 
                        height={32} 
                        className={`${accesibility? "bg-emerald-100":""} `} 
                        loading="eager"
                        onMouseEnter={()=>{if (!accesibility) handleSpeak("Si das click se activara el modo de disponibilidad para ciegos")}}
                        onClick={()=>{if(!accesibility) handleSpeak("Modo disponibilidad para ciegos activado")}}   
                    /> 
                </button>
            </div>

            {/* Register Modal */}
            {isRegisterModalOpen && (
                <RegisterModal
                    isOpen={isRegisterModalOpen}
                    onClose={handleCloseRegisterModal}
                    setIsLoged={setIsLoged}
                />
            )}
        </header>
    );
};

export default Header;
