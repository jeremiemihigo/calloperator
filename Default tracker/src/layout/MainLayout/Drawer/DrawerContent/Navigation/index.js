// material-ui
import { Box, Typography } from '@mui/material';

// project import
import menuItem from 'menu-items';
import menuOther from 'menu-other';
import React from 'react';
import { useSelector } from 'react-redux';
import NavGroup from './NavGroup';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const [item, setItem] = React.useState([]);
  const user = useSelector((state) => state.user.user);
  React.useEffect(() => {
    if (user && user.fonction === 'superUser') {
      setItem(menuItem.items);
    } else {
      setItem(menuOther.items);
    }
  }, [user]);
  const navGroups = item.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
};

export default Navigation;
