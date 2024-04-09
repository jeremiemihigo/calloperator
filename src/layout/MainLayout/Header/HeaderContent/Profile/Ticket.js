import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
// assets
import { AddTask, EmojiPeople, CalendarMonth } from '@mui/icons-material';
// import {  FreeBreakfast, } from '@mui/icons-material';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const Ticket = () => {
  const theme = useTheme();
  const navigation = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);

    if (index === 0) {
      navigation('/creationTicket', { replace: true });
    }
    if (index === 1) {
      navigation('/deadline', { replace: true });
    }
    if (index === 2) {
      navigation('/complaint', { replace: true });
    }
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0)}>
        <ListItemIcon>
          <AddTask fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="ticket creation request" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
        <ListItemIcon>
          <CalendarMonth fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Deadline and late" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
        <ListItemIcon>
          <EmojiPeople fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="complaint" />
      </ListItemButton>
    </List>
  );
};

Ticket.propTypes = {
  handleLogout: PropTypes.func
};

export default Ticket;
