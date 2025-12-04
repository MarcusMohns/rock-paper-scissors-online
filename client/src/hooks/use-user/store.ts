import { v4 as uuidv4 } from "uuid";

export const getUser = () => {
  const storedUser = localStorage.getItem("user");
  // If no user in local storage, create a new one
  return storedUser === null
    ? {
        name: "unnamed",
        id: uuidv4(),
        socketId: "0",
        color: "red",
        themePreference: "light",
        stats: {
          wins: 0,
          losses: 0,
          draws: 0,
          rating: 1000,
        },
      }
    : JSON.parse(storedUser);
};
