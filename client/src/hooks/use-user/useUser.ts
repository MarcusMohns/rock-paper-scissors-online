import { useState, useCallback, useEffect } from "react";
import { socket, gamesSocket } from "../../socketio/socket";
import type {
  UserType,
  UserResponseType,
  ErrorResponseType,
} from "../../types";
import { getUser } from "./store";
import { useError } from "../useError.ts";

export const useUser = () => {
  const [user, setUser] = useState<UserType>(getUser());
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const { error, handleSetError } = useError();

  const handleSetUser = useCallback((user: UserType) => {
    // Update both sockets, local state and storage
    socket.emit("setUser", user, (response: UserType) => {
      localStorage.setItem("user", JSON.stringify(response));
      setUser(response);
    });
    gamesSocket.emit("setUser", user);
  }, []);

  const storeStatsToLocalStorage = useCallback(
    (outcome: "win" | "loss") => {
      // Update stats in local storage
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
    },

    [user, handleSetUser]
  );

  const onGamesConnect = () => gamesSocket.emit("connected", user);
  const onDisconnect = () => {
    setIsConnected(false);
  };

  useEffect(() => {
    // Register onConnect for both sockets (provide both namespaces on the server with user data)
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

    gamesSocket.on("connect", onGamesConnect);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      gamesSocket.off("connect", onGamesConnect);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [user, handleSetError]);

  return {
    user,
    handleSetUser,
    storeStatsToLocalStorage,
    isConnected,
    error,
    handleSetError,
  };
};
