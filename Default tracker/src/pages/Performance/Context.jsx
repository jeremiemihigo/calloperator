/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from 'react';
import './performance.style.css';
export const CreateContextePerformance = createContext();

const Contexte = (props) => {
  const [dataexcel, setDataExcel] = React.useState();
  const [result, setResult] = React.useState();
  return (
    <CreateContextePerformance.Provider
      value={{
        //New config
        dataexcel,
        setDataExcel,
        result,
        setResult
      }}
    >
      <div className="performance">{props.children}</div>
    </CreateContextePerformance.Provider>
  );
};
export default React.memo(Contexte);
