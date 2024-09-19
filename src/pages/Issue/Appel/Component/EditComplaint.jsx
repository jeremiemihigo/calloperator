import { Edit, Search } from '@mui/icons-material';
import { Backdrop, Button, CircularProgress, Grid, TextField, Tooltip } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import { CreateContexteGlobal } from 'GlobalContext';
import { message } from 'antd';
import axios from 'axios';
import Input from 'components/Input';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { config, lien_issue } from 'static/Lien';
import Popup from 'static/Popup';
import Adresse from '../Adresse';
import { CreateContexteTable } from '../Contexte';
import FormItem from '../FormItem';
import OpenForm from '../Formulaire/OpenForm';

function Form() {
  const { adresse, shopSelect, setShopSelect, historique, setHistorique, initiale, setInitiale, otherItem, item, setItem } =
    React.useContext(CreateContexteTable);
  const [codeclient, setCodeclient] = React.useState('');
  const [plainteSelect, setPlainteSelect] = React.useState();
  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const [typeForm, setTypeForm] = React.useState('');

  const location = useLocation();
  const update = location.state;

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

  const [liste, setListe] = React.useState([]);
  const [sending, setSending] = React.useState(false);
  const navigate = useNavigate();
  const exit = (e) => {
    e.preventDefault();
    navigate('/call');
  };

  const setEdit = async (e) => {
    try {
      e.preventDefault();

      if (item?.adresse && !adresse) {
        success('Les nouvelles adresses du client sont obligatoire', 'error');
      } else {
        setSending(true);
        const data = {
          codeclient: codeclient,
          shop: shopSelect?.shop,
          typePlainte: plainteSelect?.title,
          plainteSelect: item.other ? (!item.oneormany ? otherItem?.title : liste.join(';')) : item?.title,
          recommandation: initiale.recommandation,
          nomClient,
          contact: initiale.contact,
          commentaire: initiale.recommandation,
          adresse,
          open: false
        };
        const donner = {
          id: update._id,
          data
        };

        const response = await axios.put(`${lien_issue}/edit_complet`, donner, config);
        if (response.status === 200) {
          setClient([...client, response.data]);
          success('Done', 'success');
          setSending(false);
          navigate('/call');
        }
        if (response.status === 201) {
          setSending(false);
          success('' + response.data, 'error');
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

  return (
    <>
      {contextHolder}
      {sending && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <div>
            <p style={{ textAlign: 'center', margin: '0px', padding: '0px' }}>Please wait...</p>
          </div>
        </Backdrop>
      )}

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
      <Grid container>
        <Grid item lg={3}>
          <Button disabled={sending} onClick={(e) => setEdit(e)} fullWidth color="secondary" variant="contained">
            <Edit fontSize="small" />
            <span style={{ marginLeft: '10px' }}>Edit</span>
          </Button>
        </Grid>
        <Grid item lg={3.5} sx={{ paddingLeft: '10px' }}>
          <Button disabled={sending} onClick={(e) => exit(e)} fullWidth color="warning" variant="contained">
            Exit
          </Button>
        </Grid>
      </Grid>

      <Popup open={open} setOpen={setOpen} title="New customer addresses">
        <Adresse setOpen={setOpen} />
      </Popup>
    </>
  );
}

export default React.memo(Form);
