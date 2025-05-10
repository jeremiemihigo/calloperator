/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from "react";
export const ContexteProjet = createContext();

const ContexteAll = (props) => {
  const [projetSelect, setProjetSelect] = React.useState();
  const [projetListe, setProjetListe] = React.useState();
  const [state, setState] = React.useState({ titre: "", etat: false });
  return (
    <ContexteProjet.Provider
      value={{
        projetSelect,
        setProjetSelect,
        projetListe,
        setProjetListe,
        state,
        setState,
      }}
    >
      {props.children}
    </ContexteProjet.Provider>
  );
};
export default React.memo(ContexteAll);
