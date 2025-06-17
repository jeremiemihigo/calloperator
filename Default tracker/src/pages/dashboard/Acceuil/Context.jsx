/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from 'react';
export const CreateContexteHome = createContext();

const ContexteHome = (props) => {
  const [match, setMatch] = React.useState();
  const [load, setLoad] = React.useState({ un: false, deux: false, trois: false });
  return (
    <CreateContexteHome.Provider
      value={{
        match,
        setMatch,
        load,
        setLoad
      }}
    >
      {props.children}
    </CreateContexteHome.Provider>
  );
};
export default React.memo(ContexteHome);
