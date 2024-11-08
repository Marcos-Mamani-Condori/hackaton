import { useEffect, useState } from "react";

let recognition = null;
if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'es-ES';
}

const useSpeechRecognition = () => {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event) => { // Removed type annotation
            console.log("on result", event);
            recognition.stop();
            setIsListening(false);
            setText(event.results[0][0].transcript); // Capture the recognized text
        };
    }, []);

    const startListening = () => {
        setText("");
        setIsListening(true);
        recognition.start();
    };

    const stopListening = () => {
        setIsListening(false);
        recognition.stop();
    };

    return {
        text,
        isListening,
        startListening,
        hasRecognitionSupport: !!recognition,
        stopListening
    };
};

export default useSpeechRecognition;
