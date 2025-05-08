import { Box, styled } from "@mui/material";
import React from "react";

import { Outlet } from "react-router";
import Topbar from "./header/Topbar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  // minHeight: '100vh',
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

const FullLayout = () => {
  return (
    <>
      <Topbar />
      <MainWrapper>
        <PageWrapper className="page-wrapper">
          <Box sx={{ padding: "10px" }}>
            <Outlet />
          </Box>
        </PageWrapper>
      </MainWrapper>
    </>
  );
};

export default FullLayout;
