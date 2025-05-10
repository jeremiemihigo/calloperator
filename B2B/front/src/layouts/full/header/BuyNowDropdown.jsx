import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { alpha, styled } from "@mui/material/styles";
import {
  IconExternalLink,
  IconSettings,
  IconStairsUp,
  IconUser,
} from "@tabler/icons-react";
import * as React from "react";
import { Link } from "react-router";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "10px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

// Styling Link within MenuItem
const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none", // Remove underline
  color: "inherit", // Ensure it inherits the primary text color
  "&:hover": {
    color: theme.palette.primary.main, // Ensure no underline on hover
  },
}));

const MenuItems = [
  {
    id: 1,
    title: "Utilisateurs",
    icon: <IconUser size={18} />,
    href: "/utilisateurs",
  },

  {
    id: 2,
    title: "Steps",
    icon: <IconStairsUp size={18} />,
    href: "/steps",
  },
];

export default function BuyNowDropdown() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        startIcon={<IconSettings />}
        variant="contained"
        color="primary"
        target="_blank"
        sx={{ borderRadius: "7px" }}
      >
        Options
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {MenuItems.map((item) => {
          return (
            <StyledLink key={item.id} to={item.href}>
              <MenuItem
                sx={{ gap: "4px", padding: "8px 16px" }}
                onClick={handleClose}
                disableRipple
              >
                {item.icon ? item.icon : <IconExternalLink size={18} />}

                {item.title}
              </MenuItem>
            </StyledLink>
          );
        })}
      </StyledMenu>
    </div>
  );
}
