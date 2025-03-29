import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Dialog,
  Grid,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";
import { ContextFeedback } from "./Context";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ title, open, setOpen, children }) {
  const handleClose = () => {
    setOpen(false);
  };
  const { statistique } = React.useContext(ContextFeedback);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Grid container>
            <Grid item lg={9} sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography
                noWrap
                sx={{ ml: 2, fontSize: "25px", flex: 1 }}
                variant="p"
                component="div"
              >
                {`${statistique.remind} remind; ${statistique.reachable} Reachable; ${statistique.unreachable} Unreacheable ; ${statistique.pending} Pending`}

                {title}
              </Typography>
            </Grid>
            <Grid item lg={3}>
              <Typography
                noWrap
                sx={{ fontSize: "25px", flex: 1, padding: 0, margin: 0 }}
                variant="p"
                component="div"
              >
                Late and Default calls
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid>{children}</Grid>
    </Dialog>
  );
}
