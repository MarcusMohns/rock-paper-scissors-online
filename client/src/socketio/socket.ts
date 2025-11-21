import io from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL: string | undefined =
  process.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://localhost:3000";

const GAMES_URL: string | undefined =
  process.env.NODE_ENV === "production"
    ? window.location.origin
    : "http://localhost:3000/games";

export const socket = io(URL, { autoConnect: true });
export const gamesSocket = io(GAMES_URL, { autoConnect: true });

// Helpful debug logging for connection attempts in the browser console
socket.io.on("open", () => console.debug("socket: main namespace connected"));
socket.io.on("close", () =>
  console.debug("socket: main namespace disconnected")
);
gamesSocket.io.on("open", () =>
  console.debug("socket: games namespace connected")
);
gamesSocket.io.on("close", () =>
  console.debug("socket: games namespace disconnected")
);
