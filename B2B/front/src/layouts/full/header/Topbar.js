import { AppBar, Box, Button, Stack, Toolbar, styled } from "@mui/material";
import { IconGift, IconLifebuoy } from "@tabler/icons-react";
import React from "react";
import { Link } from "react-router";
import adminmartLogo from "../../../assets/images/logos/bboxx.png";
import BuyNowDropdown from "./BuyNowDropdown";
import Profile from "./Profile";

const Topbar = (props) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.grey[600],
    zIndex: "50",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    [theme.breakpoints.up("lg")]: {
      minHeight: "61px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  const GhostButton = styled(Button)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.transparent,
    boxShadow: "none",
    borderRadius: "7px",
    fontWeight: 500,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
    "& .MuiButton-startIcon": {
      marginRight: "4px",
    },
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled sx={{ flexWrap: "wrap" }}>
        <Stack
          spacing={{ xs: 1, sm: 8 }}
          direction="row"
          useFlexGap
          sx={{
            flexWrap: "wrap",
            justifyContent: { xs: "center", lg: "between" },
            paddingY: { xs: "8px", lg: "0px" },
            width: { xs: "100%", lg: "auto" },
          }}
        >
          <div className="imageslogo">
            <img src={adminmartLogo} width={50} height={50} alt="logo" />
            <p>Bboxx B2B</p>
          </div>
          <Stack
            spacing={1}
            direction="row"
            sx={{ flexWrap: "wrap", display: "flex", alignItems: "center" }}
          >
            <Link to="/projets">
              <GhostButton
                startIcon={<IconLifebuoy size={18} />}
                variant="contained"
              >
                Projets
              </GhostButton>
            </Link>
            <Link to="/prospects">
              <GhostButton
                startIcon={<IconGift size={18} />}
                variant="contained"
              >
                Prospects
              </GhostButton>
            </Link>
          </Stack>
        </Stack>
        <Box flexGrow={1} />
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            flexWrap: "wrap",
            justifyContent: "center",
            gap: { xs: "10px", lg: "0px" },
            padding: { xs: "0px 0px 10px 0px", lg: "0px 0px" },
          }}
        >
          {/* <DropdownMenu/> */}

          <BuyNowDropdown />
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Topbar;
