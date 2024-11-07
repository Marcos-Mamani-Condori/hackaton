
const AnnouncementsModal = ({ isOpen, onClose, content, onNext, onPrev }) => {
    if (!isOpen) return null;

    return (
        <div>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <button 
                    className="text-2xl absolute bg-slate-950 text-white rounded-full w-20 h-20 top-2 right-2 text-lg hover:bg-slate-700" 
                    onClick={onClose}
                >
                    X
                </button>
                <div className="bg-white p-4 rounded-lg shadow-lg mt-4" style={{ height: '200px', width: '90%', maxWidth: '770px' }}>
                    <h2 className="text-xl font-bold">{content.name}</h2>
                    <p>{content.message}</p>
                    <p className="text-sm">{content.fecha}</p>
                       <br/>
                       <br/>
                       <br/>
                       <br/>
                    <div className="flex justify-between mt-4">
                        <button
                            onClick={onPrev}
                        >
                            &lt;
                        </button>
                        <button
                            onClick={onNext}
                        >
                            &gt;
                        </button>
                        </div>
                </div>
            </div>
            
        </div>
    );
};

export default AnnouncementsModal;
