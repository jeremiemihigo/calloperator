/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from 'react';
export const CreateContexteTable = createContext();

const ContexteTable = (props) => {
  const [select, setSelect] = React.useState(7);
  const [plainteSelect, setPlainteSelect] = React.useState();
  const [adresse, setAdresse] = React.useState();
  const [historique, setHistorique] = React.useState({ appel: [], info: [], ticket: [] });
  const [codeclient, setCodeclient] = React.useState('');
  const [shopSelect, setShopSelect] = React.useState('');
  const [otherItem, setOtherItem] = React.useState('');
  const [raisonOngoing, setRaisonOngoing] = React.useState('');
  const [initiale, setInitiale] = React.useState({
    recommandation: '',
    nomClient: '',
    contact: ''
  });
  const [item, setItem] = React.useState('');

  const annuler = () => {
    setInitiale({ recommandation: '', nomClient: '', contact: '' });
    setShopSelect('');
    setOtherItem('');
    setCodeclient('');
    setAdresse();
    setPlainteSelect();
    setItem('');
    setSelect(7);
    setHistorique({ appel: [], info: [], ticket: [] });
  };

  return (
    <CreateContexteTable.Provider
      value={{
        select,
        setSelect,
        plainteSelect,
        setPlainteSelect,
        adresse,
        setAdresse,
        historique,
        setHistorique,
        //----------
        codeclient,
        setCodeclient,
        shopSelect,
        setShopSelect,
        initiale,
        setInitiale,
        item,
        setItem,
        otherItem,
        setOtherItem,
        annuler: annuler,
        setRaisonOngoing,
        raisonOngoing
      }}
    >
      {props.children}
    </CreateContexteTable.Provider>
  );
};
export default React.memo(ContexteTable);
