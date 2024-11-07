'use client';

import CircularRadiusExam from "@/components/CircularRadiusExam";
import UsersCounter from "@/components/UsersCounter";
import Announcements from "@/components/Announcements";
import Homework from "@/components/Homework";
import { useState } from "react";
//import { useContext } from "react";
//import ModalContext from "@/context/ModalContext";
import ActivityCalendar from "@/components/ActivityCalendar";

const activities = [
    { day: "20", month: "Oct", title: "primer evento" },
    { day: "28", month: "Oct", title: "segundo evento" },
    { day: "02", month: "Nov", title: "tercer evento" },
    { day: "04", month: "Nov", title: "evento" },
    { day: "25", month: "Nov", title: "evento" },
];

const Home = () => {
    
    const now = new Date();
    
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className="overflow-y-auto h-lvh ">
            <Announcements isModalOpen={isModalOpen} setModalOpen={setIsModalOpen} />
            <div className="flex flex-row mx-2 md:mx-10 lg:mx-[10rem] space-x-4">
                <div className="flex-1 max-h-[200px] overflow-y-auto">
                    <Homework />
                </div>       
                <div className="flex-1">
                    <CircularRadiusExam
                        startDate={'2024-10-17'}
                        dateExam={'2024-10-29'}
                        fechaActual={now}
                    />
                </div>
            </div>
            <div className="flex flex-row mx-2 md:mx-10 lg:mx-[10rem] space-x-4">
                <div className="flex-1">
                    <UsersCounter />
                </div>
                
                <div className="flex-1 max-h-[300px] overflow-y-auto">
                    <ActivityCalendar activities={activities} /> 
                </div>
            </div>
            
            
        </div>
    );
}

export default Home;
