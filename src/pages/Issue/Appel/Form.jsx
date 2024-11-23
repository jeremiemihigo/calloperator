import { SearchOutlined } from '@ant-design/icons';
import { AirplaneTicket, Done, DoneAll, Escalator, Pause, Search } from '@mui/icons-material';
import { Button, CircularProgress, FormControl, Grid, InputAdornment, OutlinedInput, TextField, Tooltip, Typography } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import SimpleBackdrop from 'Control/Backdrop';
import { CreateContexteGlobal } from 'GlobalContext';
import { message } from 'antd';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue } from 'static/Lien';
import Popup from 'static/Popup';
import Adresse from './Adresse';
import { CreateContexteTable } from './Contexte';
import FormItem from './FormItem';
import OpenForm from './Formulaire/OpenForm';
import RaisonOngoing from './Formulaire/RaisonOngoing';

function Form({ update }) {
  const {
    adresse,
    codeclient,
    setCodeclient,
    shopSelect,
    setShopSelect,
    historique,
    setHistorique,
    initiale,
    raisonOngoing,
    plainteSelect,
    setPlainteSelect,
    setInitiale,
    otherItem,
    item,
    setItem,
    annuler
  } = React.useContext(CreateContexteTable);

  const [typeForm, setTypeForm] = React.useState('');

  const { client, setClient } = React.useContext(CreateContexteGlobal);
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

  React.useEffect(() => {
    setHistorique();
    setShopSelect('');
    setInitiale({
      recommandation: '',
      nomClient: '',
      contact: ''
    });
  }, []);

  React.useEffect(() => {
    if (update) {
      let s = shop.filter((x) => x.shop === update.shop);
      setInitiale({
        recommandation: update?.recommandation,
        nomClient: update?.nomClient,
        contact: update?.contact
      });
      setCodeclient(update?.codeclient);
      setShopSelect(s[0]);
    }
  }, [update]);

  const [openOngoing, setOpenOngoing] = React.useState(false);

  const [liste, setListe] = React.useState([]);
  const [sending, setSending] = React.useState(false);
  const [audio, setAudioB] = React.useState(null);

  const [filename, setFilename] = React.useState('');
  const sendAudioToAPI = async () => {
    try {
      const formData = new FormData();
      formData.append('file', audio, 'recording.webm');
      const response = await axios.post('http://localhost:60000/audio/upload', formData);
      setFilename(response.data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const sendAppel = async (statut, e) => {
    stopRecording();
    sendAudioToAPI();
    try {
      e.preventDefault();
      if (user?.plainteShop && user.plainteShop !== shopSelect?.shop) {
        success(`Ce client n'est pas de votre shop << ${user?.plainteShop} >>`, 'error');
      } else {
        if (item?.adresse && !adresse) {
          success('Les nouvelles adresses du client sont obligatoire', 'error');
        } else {
          setSending(true);
          const dataNonTech = {
            codeclient: codeclient,
            statut,
            delai: 'IN SLA',
            shop: shopSelect?.shop,
            typePlainte: plainteSelect?.title,
            plainteSelect: item.other ? (!item.oneormany ? otherItem?.title : liste.join(';')) : item?.title,
            recommandation: initiale.recommandation,
            nomClient,
            contact: initiale.contact,
            raisonOngoing: raisonOngoing,
            adresse,
            open: statut === 'closed' ? false : true,
            operation: statut === 'escalade' ? 'backoffice' : undefined,
            audio: filename
          };
          const dataTicket = {
            typePlainte: plainteSelect?.title,
            plainte: item?.title,
            contact: initiale.contact,
            codeclient,
            adresse,
            nomClient,
            statut,
            audio: filename,
            shop: shopSelect?.shop,
            commentaire: initiale.recommandation
          };
          const data = item?.ticket ? dataTicket : dataNonTech;
          const link = item?.ticket ? 'soumission_ticket' : 'appel';

          const response = await axios.post(`${lien_issue}/${link}`, data, config);
          if (response.status === 201) {
            success(response.data, 'warning');
            setSending(false);
          }
          if (response.status === 200) {
            success('Done', 'success');
            setClient([response.data, ...client]);
            setSending(false);
            annuler();
          }
        }
      }
    } catch (error) {
      setSending(false);
      success('Error ' + error, 'error');
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
    stopRecording();
    sendAudioToAPI();
    try {
      setSending(true);
      const data = {
        typePlainte: plainteSelect?.title,
        contact: initiale.contact,
        plainte: item?.title,
        codeclient,
        type: statut === 'Educate_the_customer' ? 'Education' : 'ticket',
        statut,
        nomClient,
        shop: shopSelect?.shop,
        commentaire: initiale.recommandation,
        audio: filename
      };
      const response = await axios.post(lien_issue + '/ticker_callcenter', data, config);
      if (response.status === 201) {
        success(response.data, 'warning');
        setSending(false);
      }
      if (response.status === 200) {
        success('Done', 'success');
        setClient([...client, response.data]);
        setSending(false);
        annuler();
      }
    } catch (error) {
      success('Erro ' + error, 'warning');
      setSending(false);
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
    if (plainteSelect) {
      searchItems();
    }
  }, [plainteSelect]);

  const [isRecording, setIsRecording] = React.useState(false);
  //const [audioUrl, setAudioUrl] = React.useState(null);
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Crée un fichier audio à partir des chunks
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        //setAudioUrl(URL.createObjectURL(audioBlob));
        // Envoie le fichier audio à l'API
        setAudioB(audioBlob);
      };
    }
  };

  const startRecording = async () => {
    setAudioB(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunksRef.current = []; // Réinitialise les chunks
    // Configure le MediaRecorder
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    // Collecte les données au fur et à mesure
    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    // Démarre l'enregistrement
    mediaRecorder.start();
    setIsRecording(true);
  };
  const change_codeclient = (e) => {
    setCodeclient(e.target.value);
    if (!isRecording) {
      startRecording();
    }
  };
  return (
    <>
      {contextHolder}
      {sending && <SimpleBackdrop open={true} title="Please wait..." taille="10rem" />}
      <Grid container>
        <Grid item lg={10} sx={{ paddingRight: '10px' }}>
          <FormControl sx={{ width: '100%' }}>
            <OutlinedInput
              size="small"
              id="header-search"
              startAdornment={
                <InputAdornment position="start" sx={{ mr: -0.5 }}>
                  <SearchOutlined />
                </InputAdornment>
              }
              aria-describedby="header-search-text"
              inputProps={{
                'aria-label': 'weight'
              }}
              value={codeclient}
              onChange={(e) => change_codeclient(e)}
              placeholder="Code client"
            />
          </FormControl>
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
                  onClick={(e) => sendAppel(item?.ticket ? 'awaiting_confirmation' : 'closed', e)}
                  color="primary"
                  variant="contained"
                >
                  {!item?.ticket ? <Done fontSize="small" /> : <AirplaneTicket fontSize="small" />}{' '}
                  <span style={{ marginLeft: '10px' }}>Demande_de_creation_ticket</span>
                </Button>
              )}

              {item && item?.ticket && item.id !== 'A8MDN' && (
                <>
                  <Button onClick={() => create_ticket('Open_technician_visit')} color="primary" variant="contained">
                    <AirplaneTicket fontSize="small" />
                    <span style={{ marginLeft: '10px' }}>Ticket_creation</span>
                  </Button>
                  <Button
                    sx={{ marginLeft: '4px' }}
                    onClick={() => create_ticket('Educate_the_customer')}
                    color="primary"
                    variant="contained"
                  >
                    Educate_the_customer
                  </Button>
                </>
              )}

              {!item?.ticket && item?.id !== 'LI2GP' && (
                <>
                  <Button sx={{ margin: '0px 5px' }} onClick={(e) => sendAppel('closed', e)} color="primary" variant="contained">
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
                <Button onClick={(e) => sendAppel('escalade', e)} color="primary" variant="contained">
                  <Escalator fontSize="small" /> <span style={{ marginLeft: '5px' }}>Escalade</span>
                </Button>
              )}
              <Typography
                onClick={() => annuler()}
                sx={{ marginLeft: '3px', cursor: 'pointer', color: 'red' }}
                color="warning"
                variant="contained"
              >
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
    </>
  );
}

export default React.memo(Form);
