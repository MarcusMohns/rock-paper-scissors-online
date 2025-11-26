import { useMemo } from "react";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles/";
import { darkTheme, lightTheme } from "./themes.ts";
import InfoBar from "./InfoBar.tsx";
import Lobby from "./lobby/Lobby";
import MainMenu from "./MainMenu.tsx";
import { UserContext } from "./Context";
import Navbar from "./navbar/Navbar.tsx";
import Footer from "./Footer.tsx";
import Room from "./room/Room.tsx";
import { useUser } from "./hooks/use-user/useUser.ts";
import { useInRoom } from "./hooks/useInRoom.ts";
import darkBg from "./assets/images/bg-dark.svg";
import lightBg from "./assets/images/bg-light.svg";
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
  const { inRoom, joinLobby, joinRoom, handleSetInRoom } = useInRoom();

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
            backgroundPosition: "bottom",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundImage:
              user.themePreference === "light"
                ? `url(${lightBg})`
                : `url(${darkBg})`,
          }}
        >
          <Navbar />
          {inRoom === "mainMenu" ? (
            <MainMenu joinLobby={joinLobby} isConnected={isConnected} />
          ) : inRoom === "lobby" ? (
            <Lobby handleSetInRoom={handleSetInRoom} />
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
