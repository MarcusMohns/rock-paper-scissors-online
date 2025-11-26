import { createContext } from "react";
import type { UserType } from "./types";

export const UserContext = createContext<{
  user: UserType;
  handleSetUser: (user: UserType) => void;
  storeStatsToLocalStorage: (outcome: "win" | "loss") => void;
}>({
  user: {
    name: "unnamed",
    id: "12345",
    socketId: "",
    color: "red",
    themePreference: "dark",
    stats: {
      wins: 0,
      losses: 0,
      draws: 0,
      rating: 1000,
    },
  },
  handleSetUser: () => {},
  storeStatsToLocalStorage: () => {},
});
