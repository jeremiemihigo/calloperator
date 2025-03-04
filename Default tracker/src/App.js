/* eslint-disable react-hooks/exhaustive-deps */
// project import
import 'bootstrap/dist/css/bootstrap.min.css';
import ScrollTop from 'components/ScrollTop';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Routes from 'routes';
import ThemeCustomization from 'themes';
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const navigation = useNavigate();

  const user = useSelector((state) => state.user?.user);
  React.useEffect(() => {
    if (user && user === 'token expired') {
      localStorage.removeItem('auth');
      navigation('/login', { replace: true });
    }
  }, [user]);

  return (
    <ThemeCustomization>
      <ScrollTop>
        <Routes />
      </ScrollTop>
    </ThemeCustomization>
  );
};

export default App;
