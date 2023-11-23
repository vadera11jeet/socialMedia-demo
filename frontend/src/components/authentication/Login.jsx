import React, { useState, forwardRef, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { loginStart } from "../../Store/slices/userAuthSlice";
import { useNavigate } from "react-router-dom";
import { IconButton, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const defaultTheme = createTheme();

const ErrorAlert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const user = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm();

  useEffect(() => {
    if (user.isUserLoggedIn) {
      navigate("/home");
    }

    if (user.error && isDirty) {
      setOpen(true);
    }
    // eslint-disable-next-line
  }, [navigate, user]);

  const [open, setOpen] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    dispatch(loginStart(data));
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
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
            Login
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

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password field is required",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    "Password must contain at least one digit, one lowercase and one uppercase letter, and be at least 8 characters long.",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="password"
                  error={errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setShowPassword((state) => !state);
                        }}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={user.loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {user.loading ? <CircularProgress /> : "Login"}
            </Button>

            <Grid container  justifyContent="space-between">
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
              <Grid item>
                <Link href="/forgot-password" variant="body2">
                  {"forgot password"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      {user?.error && (
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <ErrorAlert severity="error">{user.error}</ErrorAlert>
        </Snackbar>
      )}
    </ThemeProvider>
  );
};

export default Login;
