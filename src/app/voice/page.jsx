'use client'
import React, { useState } from "react";

const App = () => {
  // Estado para almacenar el contenido cuando se hace hover
  const [hoveredContent, setHoveredContent] = useState("");

  // Función que captura el contenido del div cuando se hace hover
  const handleMouseEnter = (event) => {
    setHoveredContent(event.target.innerText);
  };

  return (
    <div>
      <h1>Contenido en hover: {hoveredContent}</h1>

      <div 
        onMouseEnter={handleMouseEnter} 
        style={{ padding: "10px", border: "1px solid black", margin: "5px" }}
      >
        Contenido del Div 1
      </div>

      <div 
        onMouseEnter={handleMouseEnter} 
        style={{ padding: "10px", border: "1px solid black", margin: "5px" }}
      >
        Contenido del Div 2
      </div>

      <div 
        onMouseEnter={handleMouseEnter} 
        style={{ padding: "10px", border: "1px solid black", margin: "5px" }}
      >
        Contenido del Div 3
      </div>
    </div>
  );
};

export default App;
