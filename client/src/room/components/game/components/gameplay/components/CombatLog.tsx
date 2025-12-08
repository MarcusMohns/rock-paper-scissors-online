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
        variant="outlined"
        color="info"
        onClick={handleClickOpen}
        endIcon={<SubjectIcon />}
        size="small"
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
        <DialogTitle id="combat-log-dialog-title">
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <SubjectIcon /> Combat Log
            </Typography>
            <Button onClick={handleClose} color="info">
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
            }}
          >
            {log.map((logItem, index) => (
              <ListItem
                divider
                key={` ${logItem + index}`}
                sx={{
                  display: "flex",
                  width: "100%",
                  borderRadius: 1,
                  textAlign: "center",
                  justifyContent: "center",
                  bgcolor: "background.default",
                  my: 0.5,
                }}
              >
                - {logItem}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="info" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default memo(CombatLog);
