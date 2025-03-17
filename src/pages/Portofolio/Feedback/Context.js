/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from "react";
export const ContextFeedback = createContext();

const Context = (props) => {
  const [projetSelect, setProjetSelect] = React.useState("");
  const [client, setClient] = React.useState("");
  const [checked, setChecked] = React.useState("");
  const [data, setData] = React.useState([]);
  const [analyse, setAnalyse] = React.useState([]);
  const [values, setValue] = React.useState([]);

  const handleChangeBoxMany = (event) => {
    const { name, value } = event.target;
    setValue((prev) => {
      const existingIndex = prev.findIndex((item) => item.idQuestion === name);
      if (existingIndex !== -1) {
        const updatedValues = [...prev];
        if (updatedValues[existingIndex].reponse.includes(value)) {
          updatedValues[existingIndex].reponse = updatedValues[
            existingIndex
          ].reponse.filter((x) => x !== value);
        } else {
          updatedValues[existingIndex].reponse.push(value);
        }
        // Si l'entrée existe, on met à jour sa valeur
        return updatedValues;
      } else {
        return [...prev, { idQuestion: name, reponse: [value] }];
      }
    });
    // Sinon, on ajoute une nouvelle entrée
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValue((prev) => {
      const existingIndex = prev.findIndex((item) => item.idQuestion === name);
      if (existingIndex !== -1) {
        // Si l'entrée existe, on met à jour sa valeur
        const updatedValues = [...prev];
        updatedValues[existingIndex].reponse = value;
        return updatedValues;
      } else {
        // Sinon, on ajoute une nouvelle entrée
        return [...prev, { idQuestion: name, reponse: value }];
      }
    });
  };

  return (
    <ContextFeedback.Provider
      value={{
        projetSelect,
        handleChangeBoxMany,
        handleChange,
        setProjetSelect,
        values,
        setValue,
        analyse,
        setAnalyse,
        client,
        setClient,
        checked,
        data,
        setData,
        setChecked,
      }}
    >
      {props.children}
    </ContextFeedback.Provider>
  );
};
export default React.memo(Context);
