'use client';
import { useState, useEffect } from "react";

const UsersCounter = () => {
  // ELIMINAR DATOS QUEMADOS CUANDO SE LOGRE LA COMUNICACION
  const [departamentos, setDepartamentos] = useState([
    {
      "id": 2,
      "departamento": "tarija"
    },
    {
      "id": 3,
      "departamento": "cochabamba"
    },
    {
      "id": 4,
      "departamento": "potosi"
    },
    {
      "id": 5,
      "departamento": "oruro"
    },
    {
      "id": 6,
      "departamento": "santa cruz"
    },
    {
      "id": 7,
      "departamento": "beni"
    },
    {
      "id": 8,
      "departamento": "pando"
    },
    {
      "id": 9,
      "departamento": "chuquisaca"
    },
    {
      "id": 10,
      "departamento": "cochabamba"
    },
    {
      "id": 11,
      "departamento": "la paz"
    },
  ]); // ELIMINAR CUANDO ESTE LISTA LA BASE DE DATOS

  const [departamentoCount, setDepartamentoCount] = useState({}); // Estado para contar departamentos

  /*Realizar la comunicacion con el back
  const fetchDepartamentos = async () => {
    try {
      const response = await fetch("http://localhost:3001/estudiantes"); // Usando fetch
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json(); // Parsear respuesta como JSON
      setDepartamentos(data); // Suponiendo que data es un array de objetos
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDepartamentos();
  }, []);*/

  useEffect(() => {
    // Contar las ocurrencias de cada departamento
    const count = departamentos.reduce((acc, item) => {
      acc[item.departamento] = (acc[item.departamento] || 0) + 1; // Incrementar el contador
      return acc;
    }, {});

    setDepartamentoCount(count); // Guardar los resultados en el estado
  }, [departamentos]); // Ejecutar este efecto cuando departamentos cambie

  const totalCount = departamentos.length; // Total de departamentos

  return (
    <div className="p-4 max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
      <p className="text-xl font-semibold text-red-800 pb-4">Usuarios Activos</p>
      {totalCount > 0 ? (
        <div>
          {Object.entries(departamentoCount).map(([departamentoName, count]) => {
            const percentage = ((count / totalCount) * 100).toFixed(2); // Calcular porcentaje
            
            // Procesar departamentoName
            const formattedDepartamentoName = departamentoName
              .trim() // Eliminar espacios al inicio y al final
              .split(' ') // Dividir en palabras
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizar la primera letra de cada palabra
              .join(' '); // Unir las palabras nuevamente
  
            return (
              <div key={departamentoName} className="mb-4 ">
                <p className="py-1">{formattedDepartamentoName}: {percentage}%</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default UsersCounter;
