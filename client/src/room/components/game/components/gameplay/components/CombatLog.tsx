import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { List, ListItem, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import SubjectIcon from "@mui/icons-material/Subject";
import { memo, useState } from "react";

type Props = {
  log: string[];
};

const CombatLog = ({ log }: Props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        variant="contained"
        color="info"
        onClick={handleClickOpen}
        endIcon={<SubjectIcon />}
        size="small"
        sx={{
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: 2,
          px: 2,
          boxShadow: 2,
          transition: "all 0.2s ease-in-out",
        }}
      >
        Combat Log
      </Button>
      <Dialog
        disableScrollLock={true}
        maxWidth="sm"
        fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="combat-log-dialog-title"
        aria-describedby="combat-log-dialog-description"
      >
        <DialogTitle id="combat-log-dialog-title" sx={{ fontWeight: "bold" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                gap: 1,
              }}
            >
              <SubjectIcon color="info" /> Combat Log
            </Typography>
            <Button
              onClick={handleClose}
              color="inherit"
              sx={{ minWidth: "auto", fontWeight: "bold" }}
            >
              x
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {log.length === 0 && (
            <Typography variant="overline">No records found</Typography>
          )}
          <List
            sx={{
              width: "100%",
              py: 0,
            }}
          >
            {log.map((logItem, index) => (
              <ListItem
                key={` ${logItem + index}`}
                sx={{
                  display: "flex",
                  width: "100%",
                  borderRadius: 2,
                  justifyContent: "flex-start",
                  bgcolor: "action.hover",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 1,
                  my: 0.5,
                  px: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  • {logItem}
                </Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleClose}
            color="info"
            variant="contained"
            autoFocus
            sx={{ fontWeight: "bold", textTransform: "none", borderRadius: 2 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(CombatLog);
