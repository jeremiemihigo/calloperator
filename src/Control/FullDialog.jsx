import CloseIcon from '@mui/icons-material/Close';
import { AppBar, Dialog, Grid, IconButton, Slide, Toolbar, Typography } from '@mui/material';

import * as React from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ title, open, setOpen, children }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Grid container>
              <Grid item lg={12} sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography noWrap sx={{ ml: 2, fontSize: '25px', flex: 1 }} variant="p" component="div">
                  {title}
                </Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Grid>{children}</Grid>
      </Dialog>
    </React.Fragment>
  );
}
