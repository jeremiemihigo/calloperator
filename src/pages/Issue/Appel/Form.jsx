import { AirplaneTicket, Done, DoneAll, Escalator, Pause, Search } from '@mui/icons-material';
import { Backdrop, Button, CircularProgress, Grid, TextField, Tooltip, Typography } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import { CreateContexteGlobal } from 'GlobalContext';
import { message } from 'antd';
import axios from 'axios';
import Input from 'components/Input';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue } from 'static/Lien';
import Popup from 'static/Popup';
import Adresse from './Adresse';
import ConfirmBackOffice from './ConfirmBack';
import { CreateContexteTable } from './Contexte';
import FormItem from './FormItem';
import OpenForm from './Formulaire/OpenForm';
import RaisonOngoing from './Formulaire/RaisonOngoing';

function Form() {
  const {
    adresse,
    shopSelect,
    setShopSelect,
    setCodeclient,
    historique,
    setHistorique,
    initiale,
    raisonOngoing,
    setInitiale,
    otherItem,
    item,
    setItem,
    plainteSelect,
    setPlainteSelect,
    codeclient,
    annuler
  } = React.useContext(CreateContexteTable);
  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const [typeForm, setTypeForm] = React.useState('');

  const user = useSelector((state) => state?.user?.user);
  const [property, setProperty] = React.useState();
  React.useEffect(() => {
    if (user.plainte_callcenter) {
      setProperty('callcenter');
    }
    if (user.plainteShop) {
      setProperty('shop');
    }
  }, [user]);

  const [open, setOpen] = React.useState(false);
  const shop = useSelector((state) => state.shop?.shop);
  const [loadingcode, setLoadingcode] = React.useState(false);

  const { recommandation, nomClient, contact } = initiale;
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 10
    });
  };

  const plainte = useSelector((state) => state.plainte.plainte.filter((x) => x.property === property || x.property === 'all'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitiale({
      ...initiale,
      [name]: value
    });
  };
  const deedline = useSelector((state) => state.delai.delai);
  const [confirmDialog, setConfirmDialog] = React.useState({ isOpen: false, title: '' });
  const [today, setToday] = React.useState(new Date());
  const loading = async () => {
    try {
      const response = await axios.get('https://worldtimeapi.org/api/timezone/Africa/Lubumbashi');
      if (response.status === 200) {
        setToday(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    setHistorique();
    setShopSelect('');
    setInitiale({
      recommandation: '',
      nomClient: '',
      contact: ''
    });
    loading();
  }, []);

  const [openOngoing, setOpenOngoing] = React.useState(false);

  const returnDelai = async (statut) => {
    const date = today?.datetime ? today.datetime : today;
    if (deedline && today) {
      const a = _.filter(deedline, { plainte: statut });
      if (a.length > 0) {
        //si la plainte existe je cherche le jour
        let critere = a[0].critere.filter((x) => x.jour === today.day_of_week);
        if (critere.length > 0) {
          //si le critere existe
          let debutHeure = critere[0].debut.split(':')[0];
          let debutMinutes = critere[0].debut.split(':')[1];
          if (
            new Date(date).getHours() > parseInt(debutHeure) ||
            (new Date(date).getHours() === parseInt(debutHeure) && new Date(date).getMinutes() >= parseInt(debutMinutes))
          ) {
            return critere[0]?.delai;
          } else {
            return a[0]?.defaut;
          }
        } else {
          return a[0]?.defaut;
        }
      } else {
        return 0;
      }
    }
  };
  const [liste, setListe] = React.useState([]);
  const [sending, setSending] = React.useState(false);
  const sendAppel = async (statut, pro) => {
    if (user?.plainteShop && user.plainteShop !== shopSelect?.shop) {
      success(`Ce client n'est pas de votre shop << ${user?.plainteShop} >>`, 'error');
    } else {
      setSending(true);
      const delai = await returnDelai(statut);
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false
      });
      if (item?.adresse && !adresse) {
        success('Les nouvelles adresses du client sont obligatoire', 'error');
        setSending(false);
      } else {
        const dataNonTech = {
          codeclient: codeclient,
          statut,
          time_delai: delai,
          delai: 'IN SLA',
          fullDateSave: today?.datetime ? today.datetime : today,
          priorite: pro,
          shop: shopSelect?.shop,
          typePlainte: plainteSelect?.title,
          plainteSelect: item.other ? (!item.oneormany ? otherItem?.title : liste.join(';')) : item?.title,
          recommandation: initiale.recommandation,
          nomClient: initiale.nomClient,
          contact: initiale.contact,
          property,
          raisonOngoing: raisonOngoing,
          adresse,
          open: statut === 'closed' ? false : true,
          operation: statut === 'escalade' ? 'backoffice' : undefined
        };

        const dataTicket = {
          typePlainte: plainteSelect?.title,
          plainte: item?.title,
          contact: initiale.contact,
          codeclient,
          time_delai: delai,
          adresse,
          nomClient: initiale.nomClient,
          shop: shopSelect?.shop,
          commentaire: initiale.recommandation,
          fullDateSave: today?.datetime ? today.datetime : today,
          provenance: property
        };
        const data = item?.ticket ? dataTicket : dataNonTech;
        const link = item?.ticket ? (property === 'shop' ? 'soumission_ticket' : 'ticker_callcenter') : 'appel';
        const response = await axios.post(`${lien_issue}/${link}`, data, config);
        if (response.status === 200) {
          setClient([...client, response.data]);
          success('Done', 'success');
          setSending(false);
          annuler();
        }
        if (response.status === 201) {
          setSending(false);
          success('' + response.data, 'error');
        }
      }
    }
  };
  const InfoClient = async (e) => {
    e.preventDefault();
    setLoadingcode(true);
    try {
      const response = await axios.get(`${lien_issue}/infoclient/${codeclient}`, config);
      if (response.status === 200) {
        setHistorique(response.data);
        setLoadingcode(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (historique && historique?.info.length > 0) {
      setShopSelect(historique.info[0]?.shop);
      setInitiale({ ...initiale, nomClient: historique.info[0]?.nomClient });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historique]);

  React.useEffect(() => {
    if (item) {
      if (['GLVGG', 'WVW3J'].includes(item.id)) {
        setTypeForm('Regularisation');
      }
      if (item.id === 'RW38Z') {
        setTypeForm('Desangagement');
      }
      if (item.id === 'L2N7T') {
        setTypeForm('Repossession');
      }
      if (item.id === '1GS1J') {
        setTypeForm('Downgrade');
      }
      if (item.id === '9NPC7') {
        setTypeForm('Upgrade');
      }
      if (item.id === 'TRRIK') {
        setTypeForm('Information');
      }
      if (item.id === 'CF5GL') {
        setTypeForm('Rafraichissement');
      }
    }
  }, [item]);

  const create_ticket = async (statut) => {
    const delai = await returnDelai(statut);
    const data = {
      typePlainte: plainteSelect?.title,
      contact: initiale.contact,
      plainte: item?.title,
      time_delai: delai,
      codeclient,
      statut,
      customer_name: initiale?.nomClient,
      shop: shopSelect?.shop,
      commentaire: initiale.recommandation,
      fullDate: today?.datetime ? today.datetime : today,
      property
    };
    const response = await axios.post(lien_issue + '/ticker_callcenter', data, config);
    if (response.status === 200) {
      setClient([...client, response.data]);
      success('Done', 'success');
      annuler();
    } else {
      success('' + response.data, 'error');
    }
  };
  const [items, setItems] = React.useState('');
  const searchItems = () => {
    if (plainteSelect) {
      let d = plainteSelect?.alltype.filter((x) => x.property === property || x.property === 'all');
      setItems([
        ...d,
        {
          _id: 'autre',
          title: 'autre',
          idPlainte: 'autre',
          id: 'autre'
        }
      ]);
    }
  };
  React.useEffect(() => {
    searchItems();
  }, [plainteSelect]);
  return (
    <>
      {contextHolder}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={sending}>
        <div>
          <p style={{ textAlign: 'center', margin: '0px', padding: '0px' }}>Please wait...</p>
        </div>
      </Backdrop>
      <p>
        Debut : {moment(today?.datetime).format('hh:mm')} {user.plainteShop && '-------- Shop : ' + user.plainteShop}
      </p>
      <Grid container>
        <Grid item lg={10} sx={{ paddingRight: '10px' }}>
          <Input label="Code client" setValue={setCodeclient} value={codeclient} showIcon />
        </Grid>
        <Grid item lg={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="confirm the search">
            <Button onClick={(e) => InfoClient(e)} variant="contained" color="primary">
              {loadingcode ? <CircularProgress size={20} color="inherit" /> : <Search fontSize="small" />}
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => handleChange(e)}
          value={nomClient}
          style={{ marginTop: '10px' }}
          name="nomClient"
          autoComplete="off"
          fullWidth
          label="customer name"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        {shop && <AutoComplement value={shopSelect} setValue={setShopSelect} options={shop} title="Shop" propr="shop" />}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => handleChange(e)}
          value={contact}
          style={{ marginTop: '10px' }}
          name="contact"
          autoComplete="off"
          fullWidth
          label="Contact"
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        {plainte && <AutoComplement value={plainteSelect} setValue={setPlainteSelect} options={plainte} title="Plainte" propr="title" />}
      </div>
      <div style={{ marginBottom: '10px' }}>
        {items && <AutoComplement value={item} setValue={setItem} options={items} title="Probleme" propr="title" />}
      </div>
      {item && item.other && item?.tableother.length > 0 && <FormItem data={item} liste={liste} setListe={setListe} />}
      <div></div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => handleChange(e)}
          value={recommandation}
          style={{ marginTop: '10px' }}
          name="recommandation"
          autoComplete="off"
          fullWidth
          label="Commentaire"
        />
      </div>

      <OpenForm type={typeForm} />
      {item && (
        <>
          {!['GLVGG', 'WVW3J', 'CF5GL', 'TRRIK', 'RW38Z', 'L2N7T', '1GS1J', '9NPC7'].includes(item.id) && (
            <div>
              {item?.ticket && item.id === 'A8MDN' && (
                <Button
                  onClick={() => sendAppel(item?.ticket ? 'awaiting_confirmation' : 'closed', '')}
                  color="primary"
                  variant="contained"
                >
                  {!item?.ticket ? <Done fontSize="small" /> : <AirplaneTicket fontSize="small" />}{' '}
                  <span style={{ marginLeft: '10px' }}>Demande_de_creation_ticket</span>
                </Button>
              )}

              {item && item?.ticket && item.id !== 'A8MDN' && (
                <Button onClick={() => create_ticket('Open_technician_visit')} color="primary" variant="contained">
                  <AirplaneTicket fontSize="small" />
                  <span style={{ marginLeft: '10px' }}>Creation_ticket</span>
                </Button>
              )}

              {!item?.ticket && item?.id !== 'LI2GP' && (
                <>
                  <Button sx={{ margin: '0px 5px' }} onClick={() => sendAppel('closed', '')} color="primary" variant="contained">
                    <DoneAll fontSize="small" />
                    <span style={{ marginLeft: '10px' }}>Closes</span>
                  </Button>
                  <Button sx={{ margin: '0px 5px' }} onClick={() => setOpenOngoing(true)} color="secondary" variant="contained">
                    <Pause fontSize="small" />
                    <span style={{ marginLeft: '10px' }}>Ongoing</span>
                  </Button>
                </>
              )}
              {!item?.ticket && (
                <Button
                  onClick={() => {
                    setConfirmDialog({
                      isOpen: true,
                      title: 'Priority',
                      onConfirm: (e) => {
                        sendAppel('escalade', e);
                      }
                    });
                  }}
                  color="primary"
                  variant="contained"
                >
                  <Escalator fontSize="small" /> <span style={{ marginLeft: '5px' }}>Escalade</span>
                </Button>
              )}
              <Typography onClick={() => annuler()} sx={{ marginLeft: '3px' }} color="warning" variant="contained">
                Annuler
              </Typography>
              {item?.adresse && (
                <Typography
                  component="span"
                  style={{
                    textAlign: 'right',
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: 'blue',
                    fontWeight: 'bolder',
                    marginLeft: '20px',
                    textDecoration: 'underline'
                  }}
                  onClick={() => setOpen(true)}
                >
                  Adresses
                </Typography>
              )}
            </div>
          )}
        </>
      )}

      <Popup open={open} setOpen={setOpen} title="New customer addresses">
        <Adresse setOpen={setOpen} />
      </Popup>
      <Popup open={openOngoing} setOpen={setOpenOngoing} title="Raison">
        <RaisonOngoing sending={sending} func={sendAppel} />
      </Popup>
      <ConfirmBackOffice confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
}

export default Form;
