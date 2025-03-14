/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from 'react';
export const ContextFeedback = createContext();

const Context = (props) => {
  const [projetSelect, setProjetSelect] = React.useState('');
  const [client, setClient] = React.useState('');
  const [checked, setChecked] = React.useState('');
  const [data, setData] = React.useState([]);
  const [analyse, setAnalyse] = React.useState([]);

  return (
    <ContextFeedback.Provider
      value={{
        projetSelect,
        setProjetSelect,
        analyse,
        setAnalyse,
        client,
        setClient,
        checked,
        data,
        setData,
        setChecked
      }}
    >
      {props.children}
    </ContextFeedback.Provider>
  );
};
export default React.memo(Context);
