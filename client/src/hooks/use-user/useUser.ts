import { useState, useCallback, useEffect } from "react";
import { socket } from "../../socketio/socket";
import type {
  UserType,
  UserResponseType,
  ErrorResponseType,
} from "../../types";
import { defaultUser } from "../../store";
import { useError } from "../useError";

export const useUser = () => {
  const [user, setUser] = useState<UserType>({ ...defaultUser });
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const { error, handleSetError } = useError();

  const handleSetUser = useCallback((user: UserType) => {
    socket.emit("setUser", user, (response: UserType) => {
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
    });
  }, []);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      socket.emit(
        "connected",
        user,
        (response: UserResponseType | ErrorResponseType) =>
          response.type === "ok"
            ? setUser(response.data)
            : handleSetError(response.data)
      );
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [user, handleSetError]);

  const updateGameStats = useCallback(
    (outcome: "win" | "loss") => {
      const stats = {
        ...user.stats,
        wins: outcome === "win" ? user.stats.wins + 1 : user.stats.wins,
        losses: outcome === "loss" ? user.stats.losses + 1 : user.stats.losses,
        rating:
          outcome === "win"
            ? user.stats.rating + 25
            : user.stats.rating > 0
            ? // If rating is already 0, don't decrease it
              user.stats.rating - 25
            : user.stats.rating,
      };
      handleSetUser({ ...user, stats });
      localStorage.setItem("user", JSON.stringify({ ...user, stats }));
    },
    [user, handleSetUser]
  );

  return {
    user,
    handleSetUser,
    updateGameStats,
    isConnected,
    error,
    handleSetError,
  };
};
