import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { AccessTime, BugReport, Message, WorkHistory } from '@mui/icons-material';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { activeItem } from 'store/reducers/menu';
import { Settings } from '../../../../../../node_modules/@mui/icons-material/index';
// assets
// import {  FreeBreakfast, } from '@mui/icons-material';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const Setting_Call = () => {
  const theme = useTheme();
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const itemHandler = (id) => {
    dispatch(activeItem({ openItem: [id] }));
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);

    if (index === 10) {
      itemHandler('Plainte');
      navigation('/plainte', { replace: true });
    }
    if (index === 11) {
      itemHandler('Delai');
      navigation('/delai');
    }
    if (index === 12) {
      itemHandler('Communication');
      navigation('/communication');
    }
    if (index === 13) {
      itemHandler('Search history');
      navigation('/search_history');
    }
    if (index === 14) {
      itemHandler('Parameter Portofolio');
      navigation('/p_parametre', { replace: true });
    }
  };
  const userConenct = useSelector((state) => state.user?.user);

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 10} onClick={(event) => handleListItemClick(event, 10)}>
          <ListItemIcon>
            <BugReport fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Complaints" />
        </ListItemButton>
      )}
      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 11} onClick={(event) => handleListItemClick(event, 11)}>
          <ListItemIcon>
            <AccessTime fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Deedline" />
        </ListItemButton>
      )}
      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 12} onClick={(event) => handleListItemClick(event, 12)}>
          <ListItemIcon>
            <Message fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Communication" />
        </ListItemButton>
      )}
      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 13} onClick={(event) => handleListItemClick(event, 13)}>
          <ListItemIcon>
            <WorkHistory fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Search history" />
        </ListItemButton>
      )}
      {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 14} onClick={(event) => handleListItemClick(event, 14)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Parameter Portofolio" />
        </ListItemButton>
      )}
      {/* <ListItemButton selected={selectedIndex === 14} onClick={(event) => handleListItemClick(event, 14)}>
        <ListItemIcon>
          <Storage fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Servey" />
      </ListItemButton> */}
      {/* {userConenct && userConenct.fonction === 'superUser' && (
        <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
          <ListItemIcon>
            <DonutLarge fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Valve" />
        </ListItemButton>
      )} */}
    </List>
  );
};

Setting_Call.propTypes = {
  handleLogout: PropTypes.func
};

export default Setting_Call;
