import { Search } from '@mui/icons-material';
import { Card, Divider, FormControl, Grid, InputAdornment, OutlinedInput } from '@mui/material';
import { Image, Space, message } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { config, lien, lien_image } from 'static/Lien';
import DetailPlaintesRapport from './DetailPlainte';
import './historique.style.css';
import './style.css';
// assets
import { Paper, Typography } from '@mui/material';
import SimpleBackdrop from 'Control/Backdrop';
import Couleur from 'pages/Issue/Appel/Table/Color';
import { useSelector } from 'react-redux';
import Popup from 'static/Popup';
import { Clear } from '../../../node_modules/@mui/icons-material/index';
import WhyToDelete from './WhyToDelete';

function ReponseComponent() {
  const [value, setValue] = React.useState('');
  const [data, setData] = React.useState();
  const [load, setLoading] = React.useState(false);
  const [appel, setAppel] = React.useState([]);
  const user = useSelector((state) => state.user.user);

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: texte,
      duration: 5
    });
  };

  const [choose, setChoose] = React.useState(0);
  const [donner, setDonner] = React.useState();

  const show = (d) => {
    setDonner(d);
    setChoose(1);
  };

  const sendDonner = async (client) => {
    try {
      setLoading(true);
      setData();
      const reponse = await axios.get(`${lien}/oneReponse/${client}`, config);
      if (reponse.data === 'token expired') {
        localStorage.removeItem('auth');
        window.location.replace('/login');
      } else {
        setChoose(0);
        setData(_.groupBy(reponse.data.visites, 'demande.lot'));
        setAppel(_.groupBy(reponse.data.appels, 'periode'));
        setLoading(false);
        if (reponse.data.visites.length === 0) {
          success('No visits found', 'error');
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const returnHeure = (date) => {
    if (date) {
      let today = new Date(date);
      let data1 = new Date(today.setHours(today.getHours() + 1)).toISOString();
      return `${moment(data1.split('T')[0]).format('DD/MM/YYYY')} à ${data1.split('T')[1]}`;
    } else {
      return '';
    }
  };
  const [openDelete, setOpenDelete] = React.useState(false);
  const [dataDelete, setDataDelete] = React.useState();
  const funcopen = (id) => {
    setDataDelete(id);
    setOpenDelete(true);
  };
  return (
    <>
      {contextHolder}
      <SimpleBackdrop open={load} taille="20rem" title="Chargement..." />
      <Paper
        onClick={() => {
          setValue('');
          setData();
          setAppel();
        }}
        elevation={1}
        sx={{ padding: '5px', float: 'left', cursor: 'pointer' }}
      >
        <Clear />
      </Paper>
      {!data && (
        <div className="historique">
          <div>
            <p>Customer code</p>
            <Paper elevation={2}>
              <FormControl sx={{ width: '100%' }}>
                <OutlinedInput
                  size="small"
                  onKeyUp={(e) => e.keyCode === 13 && sendDonner(e.target.value)}
                  id="header-search"
                  className="inputclasse"
                  startAdornment={
                    <InputAdornment position="start" sx={{ mr: -0.5 }}>
                      <Search />
                    </InputAdornment>
                  }
                  aria-describedby="header-search-text"
                  inputProps={{
                    'aria-label': 'weight'
                  }}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder=""
                />
              </FormControl>
            </Paper>
          </div>
        </div>
      )}

      {choose === 0 && (
        <Grid container>
          <Grid item lg={9}>
            <Grid sx={{ marginTop: '10px' }}>
              {data &&
                Object.keys(data).map((item, key) => {
                  return (
                    <React.Fragment key={key}>
                      <div className="lot">{item}</div>
                      <Grid container>
                        {data['' + item].map((index, cle) => {
                          return (
                            <React.Fragment key={cle + 1}>
                              <Grid item lg={4}>
                                <Card className="reponseClasse" variant="outlined" sx={{ padding: '5px', cursor: 'pointer' }}>
                                  <Typography className="code" component="p">
                                    {index.codeclient}{' '}
                                    {user && user.fonction === 'superUser' && (
                                      <Typography
                                        component="span"
                                        onClick={() => funcopen(index)}
                                        style={{
                                          backgroundColor: 'red',
                                          color: '#fff',
                                          borderRadius: '5px',
                                          padding: '4px 10px',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        Delete
                                      </Typography>
                                    )}
                                  </Typography>
                                  <p>{index.nomClient} </p>
                                  <p>Statut du compte:</p>
                                  <p>
                                    statut client : <span style={{ fontWeight: 'bolder' }}>{index.clientStatut}</span>
                                  </p>
                                  <p>
                                    statut payement : <span style={{ fontWeight: 'bolder' }}>{index.PayementStatut}</span>
                                  </p>
                                  <p>consExpDays : {index.consExpDays} jour(s)</p>
                                  <p>Saved by : {index.agentSave.nom}</p>

                                  <p className="retard">
                                    <span style={{ fontWeight: 'bolder' }}>Kinshasa le, </span> {returnHeure(index.createdAt)}
                                  </p>
                                </Card>
                              </Grid>
                              <Grid item lg={8}>
                                <Grid container>
                                  <Grid item lg={3} sx={{ padding: '5px' }}>
                                    <Space size={12}>
                                      <Image
                                        width={150}
                                        height={150}
                                        src={`${lien_image}/${index.demande?.file}`}
                                        placeholder={
                                          <Image preview={false} src={`${lien_image}/${index.demande?.file}`} width={200} height={100} />
                                        }
                                      />
                                    </Space>
                                  </Grid>
                                  <Grid item lg={9} sx={{ paddingLeft: '30px' }}>
                                    <Grid className="reponseClasse">
                                      <p>
                                        <span style={{ fontWeight: 'bolder' }}>Statut du client : </span> {index.demande.statut};
                                      </p>
                                      <Divider />
                                      <p>
                                        <span style={{ fontWeight: 'bolder' }}>Feedback : </span> {index.demande?.raison.toLowerCase()};
                                      </p>
                                      <Divider />
                                      <p>
                                        <span style={{ fontWeight: 'bolder' }}>Adresse </span>: {index.demande?.sector},{' '}
                                        {index.demande?.cell}, {index.demande?.sat}, {index.demande.reference}{' '}
                                      </p>
                                      <Divider />
                                      <p>
                                        {index.demandeur.fonction} {index.demandeur.codeAgent}; {index.demandeur.nom};{' '}
                                      </p>
                                      {index.demande?.numero !== 'undefined' && (
                                        <p>
                                          <span style={{ fontWeight: 'bolder' }}>Numero joignable du client</span> : {index.demande?.numero}
                                        </p>
                                      )}
                                      <Divider />
                                      <p>
                                        {index.coordonnee?.longitude !== 'undefined' && `long : ${index.coordonnee?.longitude}`}
                                        {index.coordonnee?.latitude !== 'undefined' && `lat : ${index.coordonnee?.latitude}`}
                                        {index.coordonnee?.altitude !== 'undefined' && `alt : ${index.coordonnee?.altitude}`}
                                      </p>
                                      <Divider />
                                      <p className="retard">
                                        <span style={{ fontWeight: 'bolder' }}>Kinshasa le, </span>{' '}
                                        {returnHeure(index.demande.createdAt || index.demande?.updatedAt)}
                                      </p>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </React.Fragment>
                          );
                        })}

                        <div className="marge"></div>
                      </Grid>
                    </React.Fragment>
                  );
                })}
            </Grid>
          </Grid>
          <Grid item lg={3}>
            {appel &&
              Object.keys(appel).map((item, key) => {
                return (
                  <React.Fragment key={key}>
                    <div className="lot">{item}</div>
                    <Grid container>
                      {appel['' + item].map((index, cle) => {
                        return (
                          <Grid onClick={() => show(index)} item lg={12} key={cle + 1} sx={{ marginBottom: '2px' }}>
                            <Card className="reponseClasse" variant="outlined" sx={{ padding: '5px', cursor: 'pointer' }}>
                              <p className="code">
                                ID : {index.idPlainte}; type : {index.type}
                              </p>
                              <Couleur text={index.open ? 'Ouvert' : 'Fermer'} />
                              <p>statut :{index?.statut} </p>

                              <p className="retard">
                                Date {moment(index.fullDateSave).format('DD/MM/YYYY hh:mm')} property : {index?.property}
                              </p>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </React.Fragment>
                );
              })}
          </Grid>
        </Grid>
      )}
      {dataDelete && (
        <Popup open={openDelete} setOpen={setOpenDelete} title="Raison de suppression">
          <WhyToDelete id={dataDelete} />
        </Popup>
      )}

      {choose === 1 && donner && <DetailPlaintesRapport plainteSelect={donner} />}
    </>
  );
}

export default ReponseComponent;
