//creando contexto
import { createContext, useState } from "react";
const AccesibilityContext=createContext();
function AccesibilityProvider({children}){
    const [accesibility,setAccesibility]=useState(false);
    const handleSpeak=(text)=>{
        const value=new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(value);
    }
    const valueToShare={
        accesibility,
        setAccesibility,
        handleSpeak
    }
    return(
        <AccesibilityContext.Provider value={valueToShare}>
            {children}
        </AccesibilityContext.Provider>
    )

}

export {AccesibilityProvider};
export default AccesibilityContext;