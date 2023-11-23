import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/material";

const ConfirmAlert = ({
  isDialogOpen,
  setIsDialogOpen,
  dialogTitle,
  oncloseHandler,
  onAgreeAction,
  dialogText,
}) => {
  return (
    <Dialog open={isDialogOpen} onClose={setIsDialogOpen}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={oncloseHandler}>Disagree</Button>
        <Button onClick={onAgreeAction} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmAlert;
