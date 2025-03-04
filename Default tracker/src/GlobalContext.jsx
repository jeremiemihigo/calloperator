/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from 'react';
import { useNavigate } from 'react-router-dom';
export const CreateContexteGlobal = createContext();

const ContexteGlobal = (props) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };
  return (
    <CreateContexteGlobal.Provider
      value={{
        handleLogout: handleLogout
      }}
    >
      {props.children}
    </CreateContexteGlobal.Provider>
  );
};
export default React.memo(ContexteGlobal);
