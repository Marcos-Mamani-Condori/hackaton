
import { useState, useEffect } from "react";
import AnnouncementsModal from './AnnouncementsModal'; 

const Announcements = ({isModalOpen,setModalOpen}) => {
  const [data, setData] = useState([{
    "id":1,
    "name":"este es un anuncio 1",
    "message":"este es el mensaje del anuncio 1",
    "fecha": "2000-05-15"
},{
    "id":2,
    "name":"este es un anuncio 2",
    "message":"este es el mensaje del anuncio 2",
    "fecha": "2001-05-15"
},{
    "id":3,
    "name":"este es un anuncio 3",
    "message":"este es el mensaje del anuncio 3",
    "fecha": "2002-05-15"
}]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalContent, setModalContent] = useState(null);

  /*
  BORRAR CUANDO ESTE LA BASE DE DATOS DATOS QUEMADOS 
  const fetchCarrera = async () => {
    try {
      const response = await fetch("http://localhost:3001/anuncios");
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCarrera();
  }, []);
  */

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen) {
        setCurrentIndex((prevIndex) => (prevIndex === data.length - 1 ? 0 : prevIndex + 1));
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [data.length, isModalOpen]);

  const handleContainerClick = (item) => {
    setModalContent(item);
    setModalOpen(true);
  };

  const handleNextInModal = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    setModalContent(data[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const handlePrevInModal = () => {
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    setModalContent(data[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  if (!data.length) return <div className="text-center">Loading...</div>;

  return (
    <>
      <div
        className={`relative w-full max-w-3xl mx-auto p-4 rounded-lg shadow-lg ${isModalOpen ? "blur-sm" : ""}`}
        style={{
          backgroundImage: `url("https://i.blogs.es/89aaa3/650_1000_bliss-original/1366_2000.jpg")`,
          backgroundSize: "cover", 
          backgroundPosition: "center", 
        }}
      >
        <div className="relative overflow-hidden h-full">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="min-w-full flex items-center justify-center p-4 bg-transparent text-center h-full"
              >
                <div className="p-4 rounded-lg shadow-lg cursor-pointer" onClick={() => handleContainerClick(data[currentIndex])}>
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p>{item.message}</p>
                  <p className="text-sm">{item.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentIndex((prevIndex) => (prevIndex === 0 ? data.length - 1 : prevIndex - 1))}
          className="absolute left-0 top-0 bottom-0 w-12 bg-transparent text-gray-500 hover:text-blue-500 hover:bg-neutral-300 focus:outline-none"
        >
          &lt;
        </button>
        <button
          onClick={() => setCurrentIndex((prevIndex) => (prevIndex === data.length - 1 ? 0 : prevIndex + 1))}
          className="absolute right-0 top-0 bottom-0 w-12 bg-transparent text-gray-500 hover:text-blue-500 hover:bg-neutral-300 focus:outline-none"
        >
          &gt; 
        </button>
      </div>

      <AnnouncementsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        content={modalContent}
        onNext={handleNextInModal}
        onPrev={handlePrevInModal}
      />
    </>
  );
};

export default Announcements;
