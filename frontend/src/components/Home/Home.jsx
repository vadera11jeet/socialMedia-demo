import React from "react";
import Navbar from "../NavBar";
import { Box, useMediaQuery } from "@mui/material";
import UserCard from "./UserCard";
import MyPost from "./MyPost";
import Posts from "./Posts";

const Home = () => {
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  return (
    <>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreen ? "flex" : "block"}
      >
        <Box flexBasis={isNonMobileScreen ? "26%" : undefined}>
          <UserCard />
        </Box>
        <Box flexBasis={isNonMobileScreen ? "42%" : undefined}>
          <MyPost />
          <Posts />
        </Box>
      </Box>
    </>
  );
};

export default Home;
