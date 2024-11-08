'use client'
import { useState } from "react";
import useSpeechRecognition from "@/components/hook/useSpeechRecognition";

const Voice = () => {
    const {
        text,
        isListening,
        startListening,
        hasRecognitionSupport,
        stopListening
    } = useSpeechRecognition();
    
    return (
        <div>
            {hasRecognitionSupport?(
                <>
                    <div>
                        <button onClick={startListening}>Click me!</button>
                    </div>
                    {isListening?<div>Your browser is currently listening</div>:null}
                    {text}
                </>
            ):(<div>Your browser has no speech recognition</div>)}
        </div>
    );
}

export default Voice;
