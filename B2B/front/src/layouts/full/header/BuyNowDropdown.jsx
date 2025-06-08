import { Badge, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { alpha, styled } from "@mui/material/styles";
import { IconBellMinusFilled } from "@tabler/icons-react";
import moment from "moment";
import * as React from "react";
import { useSelector } from "react-redux";
import "./notification.css";

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

export default function BuyNowDropdown() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const commentaires = useSelector((state) => state.commentaire.commentaire);
  const [commentaire, setCommentaire] = React.useState();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  React.useEffect(() => {
    if (commentaires === "token_expired") {
      localStorage.removeItem("auth");
      window.location.replace("/auth/login");
    } else {
      setCommentaire(commentaires);
    }
  }, [commentaires]);
  return (
    <div>
      {commentaire && commentaire.length > 0 && (
        <>
          <Button
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            disableElevation
            onClick={handleClick}
            startIcon={
              <Badge badgeContent={commentaire.length} color="primary">
                <IconBellMinusFilled />
              </Badge>
            }
            target="_blank"
            sx={{ borderRadius: "7px", color: "white" }}
          >
            Notification
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
            {commentaire.map((index) => {
              return (
                <div key={index._id} className="commentaire_">
                  <Typography className="title">
                    {index.projet.length > 0 &&
                      `Projet : ${index.projet[0].designation}`}
                    {index.prospect.length > 0 &&
                      `Prospect : ${index.prospect[0].name}`}
                  </Typography>
                  <Typography className="commentaire">
                    {index.commentaire}
                  </Typography>
                  <div className="footer_">
                    <Typography
                      sx={{ textAlign: "left", fontSize: "11px" }}
                      component="p"
                    >
                      {index.doby}
                    </Typography>
                    <Typography
                      component="p"
                      sx={{ textAlign: "right", fontSize: "11px" }}
                    >
                      {moment(index.createdAt).fromNow()}
                    </Typography>
                  </div>
                </div>
              );
            })}
          </StyledMenu>
        </>
      )}
    </div>
  );
}
