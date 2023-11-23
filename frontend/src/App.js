import { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, createTheme, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import Signup from "./components/authentication/Signup";
import Login from "./components/authentication/Login";
import Profile from "./components/Profile/Profile";
import Home from "./components/Home/Home";
import { themeSettings } from "./theme";
import Page404 from "./components/Error/Page404";
import ForgetPassword from "./components/authentication/ForgetPassword";
import ResetPassword from "./components/authentication/ResetPassword";

function App() {
  const mode = useSelector((state) => state.util.mode);
  const { isUserLoggedIn: isAuthUser } = useSelector((state) => state.auth);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/profile/:userId"
            element={isAuthUser ? <Profile /> : <Login />}
          />
          <Route path="/home" element={isAuthUser ? <Home /> : <Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
          <Route path="*" element={<Page404 />} />
        </Routes> 
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
