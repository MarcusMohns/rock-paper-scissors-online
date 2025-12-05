import { useCallback, useState } from "react";
import { socket, gamesSocket } from "../socketio/socket.ts";
import type { RoomResponseType, ErrorType } from "../types";

export const useInRoom = () => {
  const [inRoom, setInRoom] = useState<string>("mainMenu");

  const joinRoom = useCallback(async (roomName: string) => {
    if (!roomName) {
      const error = { status: true, message: "No room name provided" };
      // Return the error so we can use it in the component
      return error;
    }
    try {
      const response = await new Promise<RoomResponseType>(
        (resolve, reject) => {
          socket.emit("joinRoom", roomName, (response: RoomResponseType) =>
            response.status === "ok"
              ? // Resolve the promise with the response
                resolve(response)
              : // Reject the promise with an error
                reject({ status: true, message: response.status })
          );
        }
      );
      // If all went well update the state and return null (component will check for error)
      setInRoom(response.roomName);
      // If we're in a game and join a new room, leave the game (the emit will take care of leaving the rooms)
      gamesSocket.emit("leaveAllGames", roomName);
      return null;
    } catch (error) {
      const errorToReturn = (error as ErrorType).status
        ? // If it's an error from the server return it
          error
        : // If it's some unexpected error return a generic error
          { status: true, message: "Error joining a room" };
      // Return the error so we can use it in the component
      return errorToReturn as ErrorType;
    }
  }, []);

  const createRoom = useCallback(async (roomName: string) => {
    if (!roomName || roomName.trim().length <= 0) {
      // If the room name is empty or only spaces
      // Return an error so we can use it in the component
      return { status: true, message: "No room name provided" };
    }
    try {
      const response = await new Promise<RoomResponseType>(
        (resolve, reject) => {
          socket.emit("createRoom", roomName, (response: RoomResponseType) =>
            response.status === "ok"
              ? // Resolve the promise with the response
                resolve(response)
              : // Reject the promise with an error
                reject({ status: true, message: response.status })
          );
        }
      );
      // If all went well update the state and return null (component will check for error)
      setInRoom(response.roomName);
      return null;
    } catch (error) {
      const errorToReturn = (error as ErrorType).status
        ? // If it's an error from the server return it
          error
        : // If it's some unexpected error return a generic error
          { status: true, message: "Error creating room" };
      // Return the error so we can use it in the component
      return errorToReturn as ErrorType;
    }
  }, []);

  const joinMainMenu = useCallback(() => {
    setInRoom("mainMenu");
    socket.emit("leaveAllRooms");
  }, []);

  return {
    inRoom,
    joinRoom,
    joinMainMenu,
    createRoom,
  };
};

export default useInRoom;
