/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from "react";
export const CreateContexteDemande = createContext();

const ContexteGlobal = (props) => {
  const [recentAnswerSelect, setRecentSelect] = React.useState("");
  const changeRecent = (data) => {
    if (data === recentAnswerSelect) {
      setRecentSelect("");
    } else {
      setRecentSelect(data);
    }
  };

  return (
    <CreateContexteDemande.Provider
      value={{ changeRecent, recentAnswerSelect }}
    >
      {props.children}
    </CreateContexteDemande.Provider>
  );
};
export default React.memo(ContexteGlobal);
