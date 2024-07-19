import SearchIcon from '@mui/icons-material/Search';
import { Button, Grid, Tooltip, Typography } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import Input from 'components/Input';
import moment from 'moment';
import React from 'react';
import { config, lien_issue } from 'static/Lien';
import Form from './Form';
import Liste from './Liste';
import './style.css';

function Index() {
  const [codeclient, setCodeclient] = React.useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    navigator.clipboard.writeText(texte);
    messageApi.open({
      type: type,
      content: texte,
      duration: 2
    });
  };

  const [donner, setDonner] = React.useState({
    fullDateSave: '',
    idPlainte: '',
    statut: '',
    cell: '',
    commune: '',
    sector: '',
    sat: '',
    reference: '',
    idVisite: ''
  });
  const { fullDateSave, idPlainte, statut, cell, commune, sector, sat, reference, idVisite } = donner;
  const openPlainte = async (e) => {
    e.preventDefault();
    const response = await axios.post(lien_issue + '/opencall', { codeclient }, config);
    if (response.status === 200) {
      const { result, visite } = response.data;
      localStorage.setItem('codeclient', result.codeclient);
      localStorage.setItem('fullDateSave', result.fullDateSave);
      localStorage.setItem('idPlainte', result.idPlainte);
      localStorage.setItem('statut', result.statut);
      if (response.data.visite) {
        setDonner({
          cell: visite.demande.cell,
          commune: visite.demande.commune,
          sector: visite.demande.sector,
          sat: visite.demande.sat,
          reference: visite.demande.reference,
          codeclient: result.codeclient,
          fullDateSave: result.fullDateSave,
          idPlainte: result.idPlainte,
          statut: result.statut
        });
        localStorage.setItem('cell', visite.demande.cell);
        localStorage.setItem('commune', visite.demande.commune);
        localStorage.setItem('sector', visite.demande.sector);
        localStorage.setItem('sat', visite.demande.sat);
        localStorage.setItem('reference', visite.demande.reference);
      } else {
        setDonner({
          codeclient: result.codeclient,
          fullDateSave: result.fullDateSave,
          idPlainte: result.idPlainte,
          statut: result.statut
        });
      }
    } else {
      success('' + response.data, 'error');
    }
  };
  React.useEffect(() => {
    if (localStorage.getItem('codeclient')) {
      setDonner({
        codeclient: localStorage.getItem('codeclient'),
        fullDateSave: localStorage.getItem('fullDateSave'),
        idPlainte: localStorage.getItem('idPlainte'),
        statut: localStorage.getItem('statut'),
        commune: localStorage.getItem('commune'),
        sector: localStorage.getItem('sector'),
        sat: localStorage.getItem('sat'),
        reference: localStorage.getItem('reference'),
        idVisite: localStorage.getItem('idVisite')
      });
      setCodeclient(localStorage.getItem('codeclient'));
    }
  }, []);
  const changeadresse = async (e, valeur) => {
    e.preventDefault();
    const response = await axios.post(lien_issue + '/changeadresse', {
      id: idVisite,
      valeur,
      idPlainte: idPlainte
    });
    if (response.status === 200) {
      success(response.data, 'success');
    } else {
      success('' + response.data, 'error');
    }
  };
  console.log(donner);
  return (
    <Grid container>
      {contextHolder}

      <Grid item lg={3}>
        {idPlainte !== '' && (
          <Grid>
            <Typography>Plainte en cours</Typography>
            <Typography>ID : {codeclient}</Typography>
            <Typography>Open at : {moment(fullDateSave).format('DD/MM/YYYY hh:mm:ss')}</Typography>
            <Typography>Status : {statut}</Typography>
          </Grid>
        )}

        {idPlainte && <p className="adresse">Confirmez l&apos;adresse physique du client</p>}
        {commune && (
          <>
            <Typography component="p">Cell : {cell}</Typography>
            <Typography component="p">Commune : {commune}</Typography>
            <Typography component="p">Sector : {sector}</Typography>
            <Typography component="p">Sat : {sat}</Typography>
            <Typography component="p">Reference : {reference}</Typography>
          </>
        )}
        {commune && (
          <Grid container>
            <Grid item lg={6}>
              <Button color="primary" variant="contained" onClick={(e) => changeadresse(e, 'puls')}>
                Identique a Puls
              </Button>
            </Grid>
            <Grid item lg={6}>
              <Button color="primary" variant="contained" onClick={(e) => changeadresse(e, 'vm')}>
                Visite menage
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>

      <Grid item lg={6} sx={{ paddingLeft: '10px' }}>
        <Grid container>
          <Grid item lg={10} sx={{ paddingRight: '10px' }}>
            <Input label="Code client" setValue={setCodeclient} value={codeclient} showIcon />
          </Grid>
          <Grid item lg={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="confirm the search">
              <Button variant="contained" color="primary" onClick={(e) => openPlainte(e)}>
                <SearchIcon fontSize="small" />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
        {idPlainte && (
          <Grid sx={{ padding: '0px 10px' }}>
            <Form setCodeclient={setCodeclient} codeclient={codeclient} setDonner={setDonner} />
          </Grid>
        )}
      </Grid>

      <Grid item lg={3}>
        <Grid sx={{ padding: '0px 10px' }}>
          <Liste />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Index;
