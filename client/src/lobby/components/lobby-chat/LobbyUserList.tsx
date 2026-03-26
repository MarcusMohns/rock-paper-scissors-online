import UserList from "../../../components/UserList";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useUserList from "../../../hooks/useUserList";

const LobbyUserList = () => {
  const { userList } = useUserList({ roomName: "lobby" });
  return (
    <Paper
      elevation={1}
      className="lobby-user-list"
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        minHeight: { xs: "0", lg: "70vh" },
        minWidth: { xs: "30%", lg: "30%" },
        maxWidth: { xs: "100%", lg: "30%" },
        borderRadius: 2,
        px: { xs: 2, lg: 2 },
        ml: { xs: 0, lg: 2 },
        mt: { xs: 2, lg: 0 },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mt: { xs: 2, lg: 1 } }}>
        Users
      </Typography>
      <UserList userList={userList} />
    </Paper>
  );
};

export default LobbyUserList;
