/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { lien_socket } from 'static/Lien';
export const CreateContexteGlobal = createContext();

const ContexteGlobal = (props) => {
  const [socket, setSocket] = React.useState(null);
  const user = useSelector((state) => state?.user.user);

  React.useEffect(() => {
    setSocket(io(lien_socket));
  }, []);
  React.useEffect(() => {
    if (socket !== null && user) {
      const data = { codeAgent: user.codeAgent, nom: user.nom, fonction: 'admin' };
      socket.emit('newUser', data);
    }
  }, [socket, user]);

  const handleLogout = async () => {
    localStorage.removeItem('auth');
    window.location.replace('/login');
  };
  return (
    <CreateContexteGlobal.Provider
      value={{
        socket,
        handleLogout
      }}
    >
      {props.children}
    </CreateContexteGlobal.Provider>
  );
};
export default React.memo(ContexteGlobal);
