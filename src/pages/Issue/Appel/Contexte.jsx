/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext } from 'react';
import { config, lien_issue } from 'static/Lien';
import axios from '../../../../node_modules/axios/index';
export const CreateContexteTable = createContext();

const ContexteTable = (props) => {
  const [satSelect, setSatSelect] = React.useState('');
  const [messages, setMessage] = React.useState();
  const [sending, setSending] = React.useState(false);
  //
  const [select, setSelect] = React.useState(7);
  const [plainteSelect, setPlainteSelect] = React.useState('');
  const [adresse, setAdresse] = React.useState();
  const [historique, setHistorique] = React.useState({ appel: [], info: [] });
  const [shopSelect, setShopSelect] = React.useState('');
  const [otherItem, setOtherItem] = React.useState('');
  const [raisonOngoing, setRaisonOngoing] = React.useState('');

  const [item, setItem] = React.useState('');
  const [state, setState] = React.useState({
    codeclient: '',
    nomClient: '',
    contact: '',
    recommandation: ''
  });

  const annuler = () => {
    setState({ codeclient: '', nomClient: '', contact: '', recommandation: '' });
    setShopSelect('');
    setOtherItem('');
    setAdresse();
    setPlainteSelect('');
    setItem('');
    setSelect(7);
    setHistorique({ appel: [], info: [] });
  };

  const onchange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value
    });
  };
  const sendEscalader = async (statut) => {
    try {
      setMessage();
      setSending(true);
      const data = {
        typePlainte: item?.title,
        codeclient: state.codeclient,
        plainteSelect: plainteSelect?.title,
        nomClient: state.nomClient,
        contact: state.contact,
        shop: shopSelect?.shop,
        statut,
        operation: 'backoffice',
        type: 'support'
      };
      if (statut === 'Downgrade') {
        data.downgrade = {
          kit: state?.kit_downgrade,
          num_synchro: state?.num_synchro_downgrade
        };
      }
      if (statut === 'Customer Information') {
        data.adresse = {
          commune: state?.commune,
          quartier: state?.quartier,
          avenue: state?.avenue,
          reference: state?.reference,
          contact: state?.new_contact,
          sat: satSelect?.sat
        };
      }
      if (statut === 'Regularisation') {
        data.regularisation = {
          jours: state?.jours,
          cu: state?.cu,
          date_coupure: state.date_coupure,
          raison: state?.raison_regul
        };
      }
      if (statut === 'Repossession volontaire') {
        data.repo_volontaire = {
          num_synchro: state?.num_synchro_repo,
          materiel: state?.materiel_repo
        };
      }
      if (statut === 'Upgrade') {
        data.upgrade = state?.materiel_upgr;
      }
      if (statut === 'Rafraichissement') {
        data.decodeur = state?.rafraichissement;
      }
      const response = await axios.post(lien_issue + '/escalader', data, config);
      if (response.status === 200) {
        setSending(false);
        annuler();
      } else {
        setSending(false);
        setMessage(response.data);
      }
    } catch (error) {
      setMessage(JSON.stringify(error));
    }
  };
  return (
    <CreateContexteTable.Provider
      value={{
        onchange,
        sendEscalader,
        satSelect,
        setSatSelect,
        state,
        select,
        setSelect,
        plainteSelect,
        setPlainteSelect,
        adresse,
        sending,
        setSending,
        setAdresse,
        historique,
        setState,
        setHistorique,
        //----------
        shopSelect,
        setShopSelect,
        messages,

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
