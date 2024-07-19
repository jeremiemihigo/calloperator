import { Clear, Search } from '@mui/icons-material';
import { Button, Card, Divider, Grid, Tooltip } from '@mui/material';
import { Image, Input, Space, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import _ from 'lodash';
import ReponseAdmin from 'pages/Demandes/Reponse';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien, lien_image } from 'static/Lien';
import Popup from 'static/Popup';
import './style.css';

function ReponseComponent() {
  const [value, setValue] = React.useState('');
  const [data, setData] = React.useState();
  const [load, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(true);
  const user = useSelector((state) => state.user.user);

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    navigator.clipboard.writeText(texte);
    messageApi.open({
      type,
      content: texte,
      duration: 5
    });
  };

  const openData = (donner) => {
    let table = ['lionel', 'p.jonathan'];
    if (user?.fonction === 'superUser' || table.includes(user?.codeAgent)) {
      setUpdate(donner);
      setOpen(true);
    } else {
      success('Cette visite ne peut pas être modifier, veuillez contacter l’équipe support en cas de besoin', 'warning');
    }
  };

  const [update, setUpdate] = React.useState();
  const key = (e) => {
    e.preventDefault();
    setValue(e.target.value);
  };
  const sendDonner = async (e) => {
    e.preventDefault();
    setShow(false);
    try {
      setLoading(true);
      setData();
      const reponse = await axios.get(`${lien}/oneReponse/${value}`, config);
      console.log(_.groupBy(reponse.data, 'demande.lot'));

      if (reponse.data === 'token expired') {
        localStorage.removeItem('auth');
        window.location.replace('/token');
      } else {
        setData(_.groupBy(reponse.data, 'demande.lot'));
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const postData = async (e) => {
    if (e.keyCode === 13 && value !== '') {
      sendDonner(e);
    }
  };
  return (
    <>
      {contextHolder}
      <Grid container>
        <Grid item lg={8}>
          <Input type="text" value={value} onChange={(e) => key(e)} onKeyUp={(e) => postData(e)} placeholder="Account ID" />
        </Grid>
        <Grid item lg={2} sx={{ paddingLeft: '10px' }}>
          <Button disabled={load} onClick={(e) => sendDonner(e)} variant="contained" color="primary">
            <Search fontSize="small" /> {load ? 'Loading...' : 'Recherche'}
          </Button>
        </Grid>
        {!show && (
          <Grid
            item
            lg={2}
            sx={{ paddingLeft: '10px', cursor: 'pointer' }}
            onClick={() => {
              setValue('');
              setShow(true);
            }}
          >
            <Clear fontSize="small" />
          </Grid>
        )}
      </Grid>

      <Grid sx={{ marginTop: '10px' }}>
        {data &&
          Object.keys(data).map((item, key) => {
            return (
              <div key={key}>
                <div className="lot">{item}</div>
                {data['' + item].map((index, cle) => {
                  return (
                    <Grid container key={cle + 1}>
                      <Grid item lg={6}>
                        <Tooltip title="Cliquez pour modifier la reponse">
                          <Card
                            className="reponseClasse"
                            onClick={() => openData(index)}
                            variant="outlined"
                            sx={{ padding: '5px', cursor: 'pointer' }}
                          >
                            <p className="code">{index.codeclient};</p>
                            <p>{index.nomClient} </p>
                            <p>Statut du compte:</p>
                            <p>
                              statut client : <span style={{ fontWeight: 'bolder' }}>{index.clientStatut}</span>
                            </p>
                            <p>
                              statut payement : <span style={{ fontWeight: 'bolder' }}>{index.PayementStatut}</span>
                            </p>
                            <p>consExpDays : {index.consExpDays} jour(s)</p>
                            <p>C.O : {index.agentSave.nom}</p>
                            <p className="retard">
                              Date {dayjs(index.createdAt).format('DD/MM/YYYY')} à {index.createdAt.split('T')[1].split(':')[0]}:
                              {index.createdAt.split('T')[1].split(':')[1]}
                            </p>
                          </Card>
                        </Tooltip>
                      </Grid>
                      <Grid item lg={6}>
                        <Grid container>
                          <Grid item lg={6} sx={{ padding: '5px' }}>
                            <Space size={12}>
                              <Image
                                width={100}
                                height={150}
                                src={`${lien_image}/${index.demande?.file}`}
                                placeholder={
                                  <Image preview={false} src={`${lien_image}/${index.demande?.file}`} width={200} height={100} />
                                }
                              />
                            </Space>
                          </Grid>
                          <Grid item lg={6}>
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
                                <span style={{ fontWeight: 'bolder' }}>Adresse </span>: {index.demande?.sector}, {index.demande?.cell},{' '}
                                {index.demande?.sat}, {index.demande.reference}{' '}
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
                                <span style={{ fontWeight: 'bolder' }}>Date</span> {dayjs(index.demande.createdAt).format('DD/MM/YYYY')} à{' '}
                                {index.demande.createdAt.split('T')[1].split(':')[0]}:{index.demande.createdAt.split('T')[1].split(':')[1]}
                              </p>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })}

                <div className="marge"></div>
              </div>
            );
          })}

        {update && (
          <Popup open={open} setOpen={setOpen} title="Modification">
            <ReponseAdmin update={update} />
          </Popup>
        )}
      </Grid>
    </>
  );
}

export default ReponseComponent;
