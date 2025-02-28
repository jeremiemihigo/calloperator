/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from 'react';
export const ContextParametre = createContext();

const Context = (props) => {
  const [formSelect, setFormSelect] = React.useState('');
  const [loadQuestion, setLoadQuestion] = React.useState(false);
  const [data, setData] = React.useState([]);
  return (
    <ContextParametre.Provider value={{ formSelect, data, setData, loadQuestion, setLoadQuestion, setFormSelect }}>
      {props.children}
    </ContextParametre.Provider>
  );
};
export default React.memo(Context);
