import { useState } from 'react';

export default function CommentReply({ comment }) {
  // Estado para las respuestas, el formulario de entrada y visibilidad de respuestas
  const [replies, setReplies] = useState(comment.replies || []);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  // Maneja el envío de una nueva respuesta
  const handleAddReply = () => {
    if (replyText.trim()) {
      const newReply = {
        id: replies.length + 1,
        author: 'Tú',
        text: replyText,
        createdAt: new Date().toLocaleString(),
      };
      setReplies([...replies, newReply]);
      setReplyText('');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-start">
        <img
          src={comment.authorAvatar}
          alt={comment.author}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="flex-1">
          <p className="font-bold">{comment.author}</p>
          <span className="text-sm text-gray-600">{comment.createdAt}</span>
          <p className="mt-2">{comment.text}</p>

          
        </div>

        <button
            className="text-blue-500 mt-2 text-sm"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? 'Ocultar respuestas' : 'Ver respuestas'}
          </button>

          {/* Respuestas */}
          {showReplies && (
            <div className="mt-4 ml-6">
              {replies.map((reply) => (
                <div key={reply.id} className="flex items-start mb-3">
                  <img
                    src="/default-avatar.png"
                    alt={reply.author}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-bold text-sm">{reply.author}</p>
                    <p className="text-sm">{reply.text}</p>
                    <p className="text-xs text-gray-500">{reply.createdAt}</p>
                  </div>
                </div>
              ))}

              {/* Formulario para agregar una respuesta */}
              <div className="flex items-center mt-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escribe una respuesta..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm mr-2"
                />
                <button
                  onClick={handleAddReply}
                  className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg"
                >
                  Responder
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
