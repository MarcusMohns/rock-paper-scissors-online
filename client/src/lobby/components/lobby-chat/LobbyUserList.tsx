import UserList from "../../../components/UserList";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useUserList from "../../../hooks/useUserList";
import { alpha } from "@mui/material";
import Box from "@mui/material/Box";
import GroupIcon from "@mui/icons-material/Group";

const LobbyUserList = () => {
  const { userList } = useUserList({ roomName: "lobby" });
  return (
    <Paper
      elevation={0}
      className="lobby-user-list"
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.05),
        minHeight: { xs: "0", lg: "70vh" },
        minWidth: { xs: "30%", lg: "30%" },
        maxWidth: { xs: "100%", lg: "30%" },
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: 2,
        ml: { xs: 0, lg: 2 },
        mt: { xs: 2, lg: 0 },
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "action.hover",
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <GroupIcon color="info" fontSize="small" />
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Users ({userList.length})
        </Typography>
      </Box>
      <Box sx={{ p: 1, flexGrow: 1, overflow: "auto" }}>
        <UserList userList={userList} />
      </Box>
    </Paper>
  );
};

export default LobbyUserList;
