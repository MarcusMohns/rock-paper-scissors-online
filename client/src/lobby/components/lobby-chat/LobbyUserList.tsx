import UserList from "../../../components/UserList";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useUserList from "../../../hooks/useUserList";

const LobbyUserList = () => {
  const { userList } = useUserList({ roomName: "lobby" });
  return (
    <Box
      className="lobby-user-list"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: { xs: "0", lg: "70vh" },
        minWidth: { xs: "30%", lg: "30%" },
        maxWidth: { xs: "100%", lg: "30%" },
        borderRadius: { xs: 0, lg: 2 },
        px: { xs: 0, lg: 2 },
        ml: { xs: 0, lg: 2 },
        mt: { xs: 2, lg: 0 },
        borderTop: { xs: "1px solid", lg: "none" },
        backgroundColor: { xs: "background.paper", lg: "primary.main" },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mt: { xs: 2, lg: 1 } }}>
        Users
      </Typography>
      <UserList userList={userList} />
    </Box>
  );
};

export default LobbyUserList;
