import { TextField } from '@mui/material';
import AutoComplement from 'Control/AutoComplet';
import React from 'react';
import { config, lien_terrain } from 'static/Lien';
import { Add } from '../../../../node_modules/@mui/icons-material/index';
import { Alert, Button, Grid } from '../../../../node_modules/@mui/material/index';
import axios from '../../../../node_modules/axios/index';

function AddServer() {
  const label = [
    { id: 1, title: 'Technicien (TECH)', value: 'tech' },
    { id: 2, title: 'Agent (SA)', value: 'agent' },
    { id: 3, title: 'Zonal_Business_Manager', value: 'ZBM' },
    { id: 4, title: 'Process_Officer', value: 'PO' },
    { id: 5, title: 'RS', value: 'RS' },
    { id: 6, title: 'Shop_Manager', value: 'SM' },
    { id: 7, title: 'Team_leader', value: 'TL' },
    { id: 8, title: 'Stagiaire', value: 'stagiaire' },
    { id: 8, title: 'Agent_de_recouvrement_(AR)', value: 'AR' },
    { id: 9, title: 'Shop_Assistante', value: 'shop_assistante' }
  ];
  const [fonction, setFonction] = React.useState('');
  const [concerne, setConcerne] = React.useState([]);
  const addfonction = () => {
    if (!concerne.includes(fonction?.value)) {
      setConcerne([...concerne, fonction.value]);
    }
  };
  const deleteOne = (one) => {
    setConcerne(concerne.filter((x) => x !== one));
  };
  const [initiale, setInitiale] = React.useState();
  const onchange = (event) => {
    const { name, value } = event.target;
    setInitiale({
      ...initiale,
      [name]: value
    });
  };
  const [message, setMessage] = React.useState('');
  const sendData = async () => {
    try {
      setMessage('');
      const response = await axios.post(
        `${lien_terrain}/servey`,
        {
          title: initiale?.title,
          concerne,
          subtitle: initiale?.subtitle,
          dateFin: initiale?.dateFin
        },
        config
      );
      if (response.status === 200) {
        setMessage('Done');
      } else {
        setMessage(JSON.stringify(response.data));
      }
    } catch (error) {
      setMessage(JSON.stringify(error));
    }
  };
  return (
    <div style={{ width: '22rem' }}>
      {message && <Alert sx={{ marginBottom: '10px' }}>{message}</Alert>}
      <Grid container sx={{ margin: '10px 0px' }}>
        <Grid item lg={10}>
          <AutoComplement value={fonction} setValue={setFonction} options={label} title="Concerne" propr="title" />
        </Grid>
        <Grid item lg={2} sx={{ display: 'flex', paddingLeft: '6px', alignItems: 'center' }}>
          <Button onClick={() => addfonction()} variant="contained" color="secondary" fullWidth>
            <Add fontSize="small" />
          </Button>
        </Grid>
      </Grid>
      <div style={{ marginBottom: '10px' }}>
        {concerne.length > 0 &&
          concerne.map((index, key) => {
            return (
              <Grid
                onClick={() => deleteOne(index)}
                key={key}
                style={{ background: '#dedede', cursor: 'pointer', borderRadius: '5px', padding: '4px', marginTop: '3px' }}
              >
                <p style={{ padding: '0px', margin: '0px' }}>
                  {index} <span style={{ color: 'red', fontSize: '10px' }}>Delete</span>
                </p>
              </Grid>
            );
          })}
      </div>

      <div style={{ marginBottom: '5px' }}>
        <TextField onChange={(e) => onchange(e)} name="title" id="outlined-multiline-static" label="Title" fullWidth />
      </div>

      <div style={{ marginBottom: '5px' }}>
        <TextField
          onChange={(e) => onchange(e)}
          name="subtitle"
          id="outlined-multiline-static"
          label="subtitle"
          multiline
          fullWidth
          rows={7}
        />
      </div>
      <div style={{ marginBottom: '5px' }}>
        <TextField onChange={(e) => onchange(e)} name="dateFin" type="date" id="outlined-multiline-static" label="DateFin" fullWidth />
      </div>
      <div>
        <Button onClick={() => sendData()} variant="contained" fullWidth color="primary">
          Save
        </Button>
      </div>
    </div>
  );
}

export default AddServer;
