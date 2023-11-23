import { Box, Typography } from "@mui/material";
import React from "react";

const Page404 = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"100vh"}
    >
      <Typography variant="h1">404 Can't find this page</Typography>;
    </Box>
  );
};

export default Page404;
