import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
// material-ui
import {
  Avatar,
  Badge,
  Box,
  ClickAwayListener,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project import
import Transitions from 'components/@extended/Transitions';
import MainCard from 'components/MainCard';
// assets
import { CloseOutlined, NotificationOutlined } from '@ant-design/icons';
import { CreateContexteGlobal } from 'GlobalContext';
import ImageUser from 'assets/images/users/iconImage.jpg';
import axios from 'axios';
import moment from 'moment';
import { config, lien_issue, returnName } from 'static/Lien';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

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

const MyNotification = () => {
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
  const [donner, setDonner] = React.useState();
  const loading = async () => {
    try {
      const response = await axios.get(lien_issue + '/notification_reader', config);
      if (response.status === 200) {
        setDonner(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading();
  }, []);

  const iconBackColorOpen = 'grey.300';
  const iconBackColor = 'grey.100';

  const { socket } = React.useContext(CreateContexteGlobal);
  const [change, setChange] = React.useState();
  React.useEffect(() => {
    socket?.on('corbeille', (a) => {
      setChange(a);
    });
  }, [socket]);
  React.useEffect(() => {
    if (change) {
      if (donner.length > 6) {
        donner.pop();
      }
      setDonner([change, ...donner]);
    }
  }, [change]);

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
        <Badge badgeContent={donner ? donner.length : 0} color="primary">
          <NotificationOutlined />
        </Badge>
      </IconButton>
      {donner && (
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
                    <List
                      component="nav"
                      sx={{
                        p: 0,
                        '& .MuiListItemButton-root': {
                          py: 0.5,
                          '& .MuiAvatar-root': avatarSX,
                          '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                        }
                      }}
                    >
                      {donner &&
                        donner?.length > 0 &&
                        donner.map((index) => {
                          return (
                            <ListItemButton key={index._id}>
                              <ListItemAvatar>
                                <Avatar
                                  sx={{
                                    color: 'success.main',
                                    bgcolor: 'success.lighter'
                                  }}
                                >
                                  <img src={ImageUser} width={30} height={30} alt="imagesUser" />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={
                                  <Typography variant="h6">
                                    {returnName(index.messages.agent)}
                                    <Typography component="span" variant="subtitle1">
                                      {' : ' + index.messages.content}
                                    </Typography>{' '}
                                    <Typography component="p" variant="subtitle2">
                                      ID complaint : {index.messages.idPlainte}
                                    </Typography>{' '}
                                    <Typography component="p" variant="subtitle2">
                                      {moment(index.messages.createdAt).fromNow()}
                                    </Typography>{' '}
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          );
                        })}

                      <ListItemButton sx={{ textAlign: 'center', py: `${12}px !important` }}>
                        <ListItemText primary={<Typography variant="h6" color="primary"></Typography>} />
                      </ListItemButton>
                    </List>
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            </Transitions>
          )}
        </Popper>
      )}
    </Box>
  );
};

export default React.memo(MyNotification);
