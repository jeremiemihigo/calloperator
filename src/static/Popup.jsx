/* eslint-disable react/prop-types */
import { Close } from "@mui/icons-material";
import { Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import * as React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Popup({ open, children, setOpen, title }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography noWrap>{title}</Typography>
        <Close
          fontSize="small"
          color="secondary"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(false)}
        />
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
export default Popup;
