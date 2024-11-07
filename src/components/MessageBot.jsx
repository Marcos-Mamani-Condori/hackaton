"use client"
import React, { useState, useEffect, useRef } from 'react';
import chatbot_icon from '@/public/static/chatbot_icon.png';
import user_icon from '@/public/static//user_icon.png';
import Image from 'next/image';
function* typewriterEffect(text) {
  for (let i = 0; i < text.length; i++) {
    yield text.slice(0, i + 1);
  }
}

function MessageBot({ text, sender }) {
  const isUser = sender === 'user';
  const icon = isUser ? (
    <Image src={user_icon} alt="User Icon" width={24} height={24} className="mr-2" />
  ) : (
    <Image src={chatbot_icon} alt="Chatbot Icon" width={24} height={24} className="mr-2" />
  );

  const [serverMessage, setServerMessage] = useState('');
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isUser) {
      const generator = typewriterEffect(text);
      const timer = setInterval(() => {
        const { value, done } = generator.next();
        if (done) {
          clearInterval(timer);
        } else {
          setServerMessage(value);
          scrollToBottom();
        }
      }, 50); // Ajusta este tiempo según sea necesario
      return () => clearInterval(timer);
    }
  }, [text, isUser]);

  return (
    <div className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'} p-2`}>
      <div className="flex items-center">
        {icon}
        <p className={`text-sm ${isUser ? 'mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white max-w-xl' : 'text-gray-700'}`}>
          {isUser ? text : serverMessage}
        </p>
      </div>
      <div ref={messageEndRef} /> {/* Elemento de referencia para el scroll */}
    </div>
  );
}

export default MessageBot;
