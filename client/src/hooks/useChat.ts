import { useState, useEffect } from "react";
import { socket } from "../socketio/socket";
import type { MessageType } from "../types";

export const useChat = () => {
  const [chat, setChat] = useState<MessageType[]>([]);

  const onMessageSent = (message: MessageType) => {
    setChat((previous) => [...previous, message]);
  };

  useEffect(() => {
    socket.on("chatMessage", onMessageSent);
    return () => {
      socket.off("chatMessage", onMessageSent);
    };
  }, []);

  return { chat };
};
