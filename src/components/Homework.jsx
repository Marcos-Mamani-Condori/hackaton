import React, { useEffect, useState } from 'react';
import lockIcon from '@/public/static/lock.svg';
import Image from 'next/image';




const Homework = () => {
  //BORRAR DATOS QUEMADOS
  const [tareas, setTareas] = useState([{
    "id":1,
    "name":"esta es la tarea de sistemas 1",
    "message":"la tarea es hacer a",
    "carrera":"sistemas",
    "fecha": "2000-05-15"
},{
    "id":2,
    "name":"esta es la tarea de sistemas 2",
    "message":"la tarea es hacer b",
    "carrera":"sistemas",
    "fecha": "2001-05-15"
},{
    "id":3,
    "name":"esta es la tarea de sistemas 3",
    "message":"la tarea es hacer c",
    "carrera":"sistemas",
    "fecha": "2002-05-15"
},{
    "id":4,
    "name":"esta es la tarea de civil 1",
    "message":"la tarea es hacer c",
    "carrera":"civil",
    "fecha": "2002-05-15"
},{
    "id":5,
    "name":"esta es la tarea de civil 2",
    "message":"la tarea es hacer a",
    "carrera":"civil",
    "fecha": "2000-05-15"
},{
    "id":6,
    "name":"esta es la tarea de sistemas 4",
    "message":"la tarea es hacer b",
    "carrera":"sistemas",
    "fecha": "2001-05-15"
},{
    "id":7,
    "name":"esta es la tarea de veterinaria 1",
    "message":"la tarea es hacer c",
    "carrera":"veterinaria",
    "fecha": "2002-05-15"
},{
    "id":8,
    "name":"esta es la tarea de civil 4",
    "message":"la tarea es hacer c",
    "carrera":"civil",
    "fecha": "2002-05-15"
},{
    "id":9,
    "name":"esta es la tarea de civil 1",
    "message":"la tarea es hacer a",
    "carrera":"civil",
    "fecha": "2000-05-15"
},{
    "id":10,
    "name":"esta es la tarea de sistemas 5",
    "message":"la tarea es hacer b",
    "carrera":"sistemas",
    "fecha": "2001-05-15"
},{
    "id":11,
    "name":"esta es la tarea de civil 5",
    "message":"la tarea es hacer c",
    "carrera":"civil",
    "fecha": "2002-05-15"
},{
    "id":12,
    "name":"esta es la tarea de veterinaria 2",
    "message":"la tarea es hacer c",
    "carrera":"veterinaria",
    "fecha": "2002-05-15"
},{
  "id":13,
  "name":"esta es la tarea de sistemas 5",
  "message":"la tarea es hacer b",
  "carrera":"civil",
  "fecha": "2001-05-15"
},{
  "id":14,
  "name":"esta es la tarea de sistemas 5",
  "message":"la tarea es hacer b",
  "carrera":"civil",
  "fecha": "2001-05-15"
},{
  "id":15,
  "name":"esta es la tarea de sistemas 5",
  "message":"la tarea es hacer b",
  "carrera":"civil",
  "fecha": "2001-05-15"
},{
  "id":16,
  "name":"esta es la tarea de sistemas 5",
  "message":"la tarea es hacer b",
  "carrera":"civil",
  "fecha": "2001-05-15"
},{
  "id":17,
  "name":"esta es la tarea de sistemas 5",
  "message":"la tarea es hacer b",
  "carrera":"civil",
  "fecha": "2001-05-15"
},{
  "id":18,
  "name":"esta es la tarea de sistemas 5",
  "message":"la tarea es hacer b",
  "carrera":"civil",
  "fecha": "2001-05-15"
},{
  "id":19,
  "name":"esta es la tarea de sistemas 5",
  "message":"la tarea es hacer b",
  "carrera":"civil",
  "fecha": "2001-05-15"
},{
  "id":20,
  "name":"esta es la tarea de sistemas 5",
  "message":"la tarea es hacer b",
  "carrera":"civil",
  "fecha": "2001-05-15"
},]);
  const [usuarios, setUsuarios] = useState([{
    "id":1,
    "carrera":"sistemas",
    "rol":"administrador"
},{
    "id":2,
    "carrera":"civil",
    "rol":"usuario"
},{
    "id":3,
    "carrera":"veterinaria",
    "rol":"premium"
},{
    "id":4,
    "carrera":"sistemas",
    "rol":"usuario"
},{
    "id":5,
    "carrera":"civil",
    "rol":"premium"
},{
    "id":6,
    "carrera":"veterinaria",
    "rol":"premium"
},{
    "id":7,
    "carrera":"sistemas",
    "rol":"premium"
}]);
//BORRAR DATOS QUEMADOS
const userId = 2; // Supongamos que el ID del usuario que está viendo la página es el 2.

  /*useEffect(() => {
    // Obtener datos del usuario
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`http://localhost:3001/usuarios`);
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    const fetchTareas = async () => {
      try {
        const response = await fetch(`http://localhost:3001/tareas`);
        const data = await response.json();
        setTareas(data);
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
      }
    };

    fetchUsuarios();
    fetchTareas();
  }, []);
*/
  // Encontrar al usuario con el userId
  const usuarioActual = usuarios.find(usuario => usuario.id === userId);

  // Filtrar las tareas según la carrera del usuario, si el usuario está definido
  const tareasFiltradas = usuarioActual
    ? tareas.filter(tarea => tarea.carrera === usuarioActual.carrera)
    : [];

  
  const aplicarBlur = usuarioActual && usuarioActual.rol !== 'premium' && usuarioActual.rol !== 'administrador';

  return (
<div className="p-4 max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
      {aplicarBlur ? (
        <div className="flex flex-col items-center" style={{
          backgroundImage: `url("https://www.shutterstock.com/image-photo/close-old-dictionary-page-solution-260nw-1257550180.jpg")`,
          backgroundSize: "cover", 
          backgroundPosition: "center", 
        }}>
          <Image src={lockIcon} alt="Candado" className="w-10 h-10 mb-2" />
          <h1 className="text-center text-slate-600">Contenido disponible solo para usuarios premium</h1>
        </div>
      ) : (
        <ul>
          {tareasFiltradas.length > 0 ? (
            tareasFiltradas.map(tarea => (
              <li key={tarea.id} className="mb-4">
                <strong>{tarea.name}</strong>
                <ul className="ml-4 list-disc">
                  <li>{tarea.message}</li>
                  <li>{tarea.fecha}</li>
                </ul>
              </li>
            ))
          ) : (
            <p>No hay tareas disponibles para tu carrera.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Homework;
