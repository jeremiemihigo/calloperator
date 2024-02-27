/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
export const CreateContexte = createContext();

const ContexteAll = (props) => {
  const navigation = useNavigate();
  const LogOut = () => {
    localStorage.removeItem('bboxxSupprtNom');
    localStorage.removeItem('bboxxSupprtCode');
    localStorage.removeItem('bboxxSupprtZone');
    navigation('/login', { replace: true });
  };

  const [demande, setDemande] = useState();
  const [user, setUser] = useState();
  const [update, setUpdate] = useState();
  const [chat, setChat] = useState();

  return (
    <CreateContexte.Provider
      value={{
        LogOut,
        user,
        setUser,
        demande,
        setDemande,
        update,
        setUpdate,
        chat,
        setChat
      }}
    >
      {props.children}
    </CreateContexte.Provider>
  );
};
export default React.memo(ContexteAll);
