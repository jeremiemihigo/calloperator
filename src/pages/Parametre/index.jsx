import React from 'react';
import * as xlsx from 'xlsx';
import { Alert, Button, Grid, CircularProgress, Fab } from '@mui/material';
import axios from 'axios';
import { lien, config } from 'static/Lien';
import { Delete, Edit, Search } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';
import { Input } from 'antd';
import './style.css';
import { useSelector } from 'react-redux';
import Popup from 'static/Popup';
import AutoComplement from 'Control/AutoComplet';
// import DirectionSnackbar from "../static/SnackBar";

function Parametre() {
  const user = useSelector((state) => state.user?.user);
  const regions = useSelector((state) => state.zone.zone);
  const [excelData, setExcelData] = React.useState();
  const [excelFileError, setExcelFileError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [deleting, setDelete] = React.useState(false);

  const [valueRegionSelect, setValueRegionSelect] = React.useState('');
  const [valueShopSelect, setValueShopSelect] = React.useState('');
  const [initial, setInitial] = React.useState({
    cu: '',
    name: ''
  });
  const { cu, name } = initial;

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setExcelData(json);
        setLoading(false);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const sendData = async () => {
    setLoading(true);
    let dataSend = [];

    let nombre = 0;
    try {
      for (let i = 0; i < excelData.length; i++) {
        nombre = nombre + 1;
        dataSend.push(excelData[i]);
        if (nombre == 100) {
          const response = await axios.post(lien + '/paramatre', {
            data: dataSend
          });
          console.log(response);
          nombre = 0;
          dataSend = [];
        }
        if (i === excelData.length - 1) {
          const response = await axios.post(lien + '/paramatre', {
            data: dataSend
          });
          console.log(response);
        }
      }
      // window.location.replace('/parametre');
    } catch (error) {
      setLoading(false);
      setExcelFileError(error);
    }
  };
  const DeleteAll = () => {
    setDelete(true);
    axios
      .delete(lien + '/deleteParams', config)
      .then((response) => {
        if (response) {
          window.location.replace('/clients');
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  const [clients, setClient] = React.useState();
  const [codeClient, setCodeClient] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const fetchClient = async () => {
    const response = await axios.get(`${lien}/customer/${codeClient}`);
    setClient(response.data);
  };

  const openPopup = () => {
    setOpen(true);
    setInitial({
      cu: clients.customer_cu,
      name: clients.nomClient
    });
  };

  const [pending, setPending] = React.useState(false);
  const handleSubmit = async () => {
    setPending(true);
    const response = await axios.put(lien + '/parametre', {
      customer: clients.customer,
      nomClient: name,
      codeCu: cu,
      idZone: valueRegionSelect?.idZone,
      idShop: valueShopSelect?.idShop
    });
    if (response.status === 200) {
      setClient(response.data);
      setPending(false);
    }
    setPending(false);
  };

  return (
    <div>
      {excelFileError && (
        <div className="mb-4">
          <Alert severity="warning" variant="standard">
            {excelFileError && excelFileError}
          </Alert>
        </div>
      )}

      {(user && user.fonction === 'admin') ||
        (user.fonction === 'superUser' && (
          <form className="form-group" autoComplete="off">
            <Grid container>
              <Grid item lg={6}>
                <form>
                  <Input type="file" name="upload" id="upload" onChange={readUploadFile} />
                </form>
              </Grid>
              <Grid item lg={3}>
                <Button disabled={loading} color="primary" variant="contained" onClick={() => sendData()} sx={{ marginLeft: '10px' }}>
                  {loading && <CircularProgress size={15} sx={{ marginRight: '15px' }} color="inherit" />}{' '}
                  {!loading && <SendIcon fontSize="small" />}
                  <span style={{ fontSize: '12px', padding: '0px', margin: '0px' }}>{loading ? 'Sending...' : 'Envoyer'}</span>
                </Button>
                <Button disabled={deleting} onClick={() => DeleteAll()} color="warning" variant="contained" sx={{ marginLeft: '10px' }}>
                  <Delete fontSize="small" /> <span style={{ fontSize: '12px', padding: '0px', margin: '0px' }}>Delete all</span>
                </Button>
              </Grid>
            </Grid>
          </form>
        ))}
      <Grid container sx={{ marginTop: '10px', marginBottom: '10px' }}>
        <Grid item lg={8}>
          <Input onChange={(e) => setCodeClient(e.target.value)} placeholder="Code client" />
        </Grid>
        <Grid item lg={4} sx={{ paddingLeft: '10px' }}>
          <Button variant="contained" color="primary" onClick={() => fetchClient()}>
            <Search fontSize="small" />
          </Button>
        </Grid>
      </Grid>

      {clients && (
        <table>
          <thead>
            <tr>
              <td>customer</td>
              <td>customer cu</td>
              <td>name</td>
              <td>Region</td>
              <td>Shop</td>
              <td>Modifier</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{clients.customer}</td>
              <td>{clients.customer_cu}</td>
              <td>{clients.nomClient}</td>
              <td>{clients.region.denomination}</td>
              <td>{clients.shop.shop}</td>
              <td>
                <Fab size="small" color="primary" onClick={() => openPopup(true)}>
                  <Edit fontSize="small" />
                </Fab>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <Popup open={open} setOpen={setOpen} title="Modifiez les détails du client">
        <Grid container sx={{ width: '20rem' }}>
          <Grid item lg={12} sm={12} xs={12} sx={{ marginTop: '10px' }}>
            <Input
              onChange={(e) =>
                setInitial({
                  ...initial,
                  name: e.target.value
                })
              }
              value={name}
              placeholder="customer name"
            />
          </Grid>
          <Grid item lg={12} sm={12} xs={12} sx={{ marginTop: '10px' }}>
            <Input
              value={cu}
              onChange={(e) =>
                setInitial({
                  ...initial,
                  cu: e.target.value
                })
              }
              placeholder="customer_cu"
            />
          </Grid>
          <Grid item lg={12} sm={12} xs={12} sx={{ marginTop: '10px' }}>
            <AutoComplement
              value={valueRegionSelect}
              setValue={setValueRegionSelect}
              options={regions}
              title="Regions"
              propr="denomination"
            />
          </Grid>
          <Grid item lg={12} sm={12} xs={12} sx={{ marginTop: '10px' }}>
            {valueRegionSelect !== '' && valueRegionSelect !== null && (
              <AutoComplement
                value={valueShopSelect}
                setValue={setValueShopSelect}
                options={valueRegionSelect && valueRegionSelect.shop}
                title="Shop"
                propr="shop"
              />
            )}
          </Grid>
          <Grid item lg={12} sm={12} xs={12} sx={{ marginTop: '10px' }}>
            <Button disabled={pending} fullWidth color="primary" variant="contained">
              <Edit fontSize="small" sx={{ marginRight: '7px' }} onClick={() => handleSubmit()} />
              Valider
            </Button>
          </Grid>
        </Grid>
      </Popup>
    </div>
  );
}

export default Parametre;
