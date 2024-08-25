import { useRef, useState } from 'react';

// material-ui
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import { Badge, Box, ClickAwayListener, Divider, IconButton, List, Paper, Popper, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';

// project import
import Transitions from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';

// assets
import { CloseOutlined } from '@ant-design/icons';
import { CreateContexteGlobal } from 'GlobalContext';
import Dot from 'components/@extended/Dot';
import { useSelector } from 'react-redux';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

const Connected = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = 'grey.300';
  const iconBackColor = 'grey.100';
  const user = useSelector((state) => state.user?.user);
  const { user_connect } = React.useContext(CreateContexteGlobal);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        disableRipple
        color="secondary"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={user_connect.filter((x) => x.nom !== undefined).length - 1} color="primary">
          <WifiTetheringIcon />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -5 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285,
                maxWidth: 420,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285
                }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title=""
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <IconButton size="small" onClick={handleToggle}>
                      <CloseOutlined />
                    </IconButton>
                  }
                >
                  <Typography sx={{ textAlign: 'center', marginTop: '10px', marginBottom: '0px', padding: 0 }}>Online users</Typography>
                  <List
                    component="nav"
                    sx={{
                      p: 1,
                      '& .MuiListItemButton-root': {
                        py: 0.5,
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    {user_connect.reverse().map((index, key) => {
                      return (
                        index.nom !== undefined &&
                        index.codeAgent !== user?.codeAgent && (
                          <div
                            key={key}
                            style={{
                              display: 'flex',
                              borderRadius: '10px',
                              marginBottom: '5px',
                              alignItems: 'center',
                              background: '#dedede',
                              padding: '5px'
                            }}
                          >
                            <div style={{ width: '10%', display: 'flex', justifyContent: 'center' }}>
                              <Dot color="success" />
                            </div>
                            <div style={{ width: '90%', padding: 0 }}>
                              <p style={{ padding: 0, margin: 0, fontSize: '10px', fontWeight: 'bolder' }}>{index?.nom}</p>
                            </div>
                          </div>
                        )
                      );
                    })}

                    <Divider />
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Connected;
