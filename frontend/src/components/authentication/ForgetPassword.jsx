import React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import Link from "@mui/material/Link";
// import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { forgotPasswordStart } from "../../Store/slices/userAuthSlice";
// import { IconButton, Snackbar } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

const defaultTheme = createTheme();

const ForgetPassword = () => {
  const dispatch = useDispatch();

  const { forgotPasswordLoading } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(forgotPasswordStart({ email: data.email }));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Controller
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              }}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                  error={errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={forgotPasswordLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {forgotPasswordLoading ? <CircularProgress /> : "Submit"}
            </Button>
          </Box>
        </Box>
      </Container>
      {/* {user?.error && (
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <ErrorAlert severity="error">{user.error}</ErrorAlert>
        </Snackbar>
      )} */}
    </ThemeProvider>
  );
};

export default ForgetPassword;
