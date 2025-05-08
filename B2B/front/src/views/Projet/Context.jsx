/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from "react";
export const ContexteProjet = createContext();

const ContexteAll = (props) => {
  const [projetSelect, setProjetSelect] = React.useState();
  return (
    <ContexteProjet.Provider
      value={{
        projetSelect,
        setProjetSelect,
      }}
    >
      {props.children}
    </ContexteProjet.Provider>
  );
};
export default React.memo(ContexteAll);
