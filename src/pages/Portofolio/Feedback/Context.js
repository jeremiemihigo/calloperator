/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { createContext } from "react";
import { io } from "socket.io-client";
import { config, lien, lien_socket, portofolio } from "static/Lien";
export const ContextFeedback = createContext();

const Context = (props) => {
  const [projetSelect, setProjetSelect] = React.useState("");
  const [client, setClient] = React.useState("");
  const [checked, setChecked] = React.useState("");
  const [data, setData] = React.useState([]);
  const [analyse, setAnalyse] = React.useState([]);
  const [values, setValue] = React.useState([]);
  const [statistique, setStatistique] = React.useState({
    remind: 0,
    reachable: 0,
    unreachable: 0,
    pending: 0,
  });

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

  const clientStat = async () => {
    try {
      const response = await axios.get(portofolio + "/clientStat", config);
      if (response.status === 200) {
        setStatistique(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    clientStat();
  }, []);
  const [socket, setSocket] = React.useState(null);
  React.useEffect(() => {
    setSocket(io(lien_socket));
  }, []);
  React.useEffect(() => {
    if (socket) {
      socket.on("portofolio", (donner) => {
        setStatistique({
          ...statistique,
          [donner]: statistique[donner] + 1,
        });
      });
    }
  }, [socket]);
  const [feedback, setFeedback] = React.useState();
  const loadingFeedback = async () => {
    try {
      const response = await axios.get(lien + "/readfeedback/portofolio");
      if (response.status === 200) {
        setFeedback(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loadingFeedback();
  }, []);

  return (
    <ContextFeedback.Provider
      value={{
        projetSelect,
        handleChangeBoxMany,
        handleChange,
        setProjetSelect,
        statistique,
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
        feedback,
      }}
    >
      {props.children}
    </ContextFeedback.Provider>
  );
};
export default React.memo(Context);
