import { useMemo } from "react";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles/";
import { darkTheme, lightTheme } from "./themes.ts";
import InfoBar from "./InfoBar.tsx";
import Lobby from "./lobby/Lobby.tsx";
import MainMenu from "./MainMenu.tsx";
import { UserContext } from "./Context.tsx";
import Navbar from "./navbar/Navbar.tsx";
import Footer from "./Footer.tsx";
import Room from "./room/Room.tsx";
import { useUser } from "./hooks/use-user/useUser.ts";
import { useInRoom } from "./hooks/useInRoom.ts";
import ToastAlert from "./components/ToastAlert.tsx";

export default function App() {
  const {
    user,
    handleSetUser,
    isConnected,
    storeStatsToLocalStorage,
    error,
    handleSetError,
  } = useUser();
  const { inRoom, joinRoom, joinMainMenu, createRoom } = useInRoom();

  const contextValue = useMemo(
    () => ({
      user,
      handleSetUser,
      storeStatsToLocalStorage,
    }),
    [user, handleSetUser, storeStatsToLocalStorage]
  );

  return (
    <UserContext.Provider value={contextValue}>
      <ThemeProvider
        theme={user.themePreference === "light" ? lightTheme : darkTheme}
      >
        <CssBaseline />
        {!isConnected && <InfoBar />}
        <Box
          component="main"
          className="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Navbar />
          {inRoom === "mainMenu" ? (
            <MainMenu joinRoom={joinRoom} isConnected={isConnected} />
          ) : inRoom === "lobby" ? (
            <Lobby
              joinMainMenu={joinMainMenu}
              joinRoom={joinRoom}
              createRoom={createRoom}
            />
          ) : (
            <Room roomName={inRoom} joinRoom={joinRoom} />
          )}
          <ToastAlert
            open={error.status}
            handleClose={() => handleSetError({ ...error, status: false })}
            message={error.message}
            severity="warning"
          />
          <Footer />
        </Box>
      </ThemeProvider>
    </UserContext.Provider>
  );
}
