"use client";

import React, { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import ModalContext from '@/context/ModalContext';
import getSocket from "@/libs/socket";

function LikeButton({ messageId, username }) {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const { data: session } = useSession();
  const { setIsRegisterModalOpen, setIsLoged } = useContext(ModalContext);
  const socket = getSocket(); // Obtener la instancia del socket

  useEffect(() => {
    if (!socket) {
      console.log("Socket no está disponible.");
      return;
    }

    const accessToken = session?.user?.accessToken;

    const loadLikeData = () => {
      if (socket.connected) {
        socket.emit("get_like_count", messageId);

        if (accessToken) {
          socket.emit("check_user_like", { messageId, token: accessToken });
        } else {
          console.log("No hay token, no se puede comprobar si el usuario ha dado like.");
        }
      }
    };

    loadLikeData();

    const handleLikeCountResponse = ({ preguntas_id, total_likes }) => {
      if (preguntas_id === messageId) {
        setLikeCount(total_likes);
      }
    };

    const handleUserLikeStatus = ({ preguntas_id, has_liked }) => {
      if (preguntas_id === messageId) {
        setHasLiked(has_liked);
        localStorage.setItem(`liked_${messageId}`, JSON.stringify(has_liked));
      }
    };

    socket.on("like_count_response", handleLikeCountResponse);
    socket.on("user_like_status", handleUserLikeStatus);

    return () => {
      socket.off("like_count_response", handleLikeCountResponse);
      socket.off("user_like_status", handleUserLikeStatus);
    };
  }, [messageId, socket, session]);

  const handleLikeClick = () => {
    const accessToken = session?.user?.accessToken;

    if (!socket || !accessToken) {
      setIsRegisterModalOpen(true);
      setIsLoged(false);
      return;
    }

    socket.emit("like_pregunta", { messageId, username, token: accessToken });

    setLikeCount((prevCount) => hasLiked ? Math.max(prevCount - 1, 0) : prevCount + 1);
    setHasLiked(!hasLiked);
    localStorage.setItem(`liked_${messageId}`, JSON.stringify(!hasLiked));
  };

  return (
    <div className="flex justify-start mt-2">
      <button onClick={handleLikeClick}>
        <span className={hasLiked ? "bg-red-500 text-white p-2 rounded" : "bg-transparent"}>
          👍
        </span>
      </button>
      <span className="ml-2">{likeCount > 0 ? likeCount : ""}</span>
    </div>
  );
}

export default LikeButton;
