import React, { forwardRef, useState } from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const ErrorAlert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackBarAlert = ({ errorMessage }) => {
  const [open, setOpen] = useState(!!errorMessage);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <ErrorAlert severity="error">{errorMessage}</ErrorAlert>
    </Snackbar>
  );
};

export default SnackBarAlert;
