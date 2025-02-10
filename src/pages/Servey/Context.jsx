/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from 'react';
export const CreateContextServey = createContext();

const ContexteServey = (props) => {
  const [init, setInit] = React.useState();
  const [projetselect, setProjetSelect] = React.useState();
  return (
    <CreateContextServey.Provider value={{ init, setInit, projetselect, setProjetSelect }}>{props.children}</CreateContextServey.Provider>
  );
};
export default React.memo(ContexteServey);
