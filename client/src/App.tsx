import { useMemo } from "react";
import "./App.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { ThemeProvider, alpha } from "@mui/material/styles/";
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
    [user, handleSetUser, storeStatsToLocalStorage],
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
          sx={(theme) => ({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
            minHeight: "100vh",
            bgcolor: "background.default",
            backgroundImage: `
              radial-gradient(at 10% 10%, ${alpha(theme.palette.primary.main, 0.05)} 0px, transparent 55%),
              radial-gradient(at 90% 10%, ${alpha(theme.palette.secondary.main, 0.25)} 0px, transparent 55%),
              radial-gradient(at 90% 90%, ${alpha(theme.palette.info.main, 0.15)} 0px, transparent 55%),
              radial-gradient(at 10% 90%, ${alpha(theme.palette.success.main, 0.15)} 0px, transparent 55%)
            `,
          })}
        >
          <Navbar joinMainMenu={joinMainMenu} inRoom={inRoom} />
          {inRoom === "mainMenu" ? (
            <MainMenu joinRoom={joinRoom} isConnected={isConnected} />
          ) : inRoom === "lobby" ? (
            <Lobby joinRoom={joinRoom} createRoom={createRoom} />
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
