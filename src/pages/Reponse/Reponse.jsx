import { Card, Grid, Typography, Button, Tooltip } from '@mui/material';
import React from 'react';
import axios from 'axios';
import { dateFrancais, config, lien, lien_image } from 'static/Lien';
import ReponseAdmin from 'pages/Demandes/Reponse';
import { Input } from 'antd';
import { Image, Space } from 'antd';
import { Search, Clear } from '@mui/icons-material';
import Popup from 'static/Popup';
import './style.css';

function ReponseComponent() {
  const [value, setValue] = React.useState('');
  const [data, setData] = React.useState();
  const [load, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(true);

  const openData = (donner) => {
    setUpdate(donner);
    setOpen(true);
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
      if (reponse.data === 'token expired') {
        localStorage.removeItem('auth');
        window.location.replace('/token');
      } else {
        setData(reponse.data);
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
          data.length > 0 &&
          !show &&
          data.map((index) => {
            return (
              <div key={index._id}>
                <div className="lot">mois de {index.demande.lot}</div>
                <Grid container>
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
                        <p>C.O : {index.co.nom}</p>
                        <p className="retard">
                          Date {dateFrancais(index.createdAt)} à {index.createdAt.split('T')[1].split(':')[0]}:
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
                            src={`${lien_image}/${index.demande.file}`}
                            placeholder={<Image preview={false} src={`${lien_image}/${index.demande.file}`} width={200} height={100} />}
                          />
                        </Space>
                      </Grid>
                      <Grid item lg={6}>
                        <Grid className="reponseClasse">
                          <Typography component="p">
                            Client {index.demande.statut};
                            <p>
                              {' '}
                              Feedback : <span style={{ fontWeight: 'bolder' }}>{index.demande?.raison.toLowerCase()}</span>;
                            </p>
                            <p>
                              {index.demande?.sector}, {index.demande?.cell}, {index.demande?.sat}, {index.demande.reference}{' '}
                            </p>
                          </Typography>
                          <p>
                            {index.agent.fonction} {index.agent.codeAgent}; {index.agent.nom}; {index.agent.telephone}
                          </p>

                          <p>Numero joignable du client : {index.demande?.numero}</p>
                          <p className="retard">
                            Date {dateFrancais(index.demande.createdAt)} à {index.demande.createdAt.split('T')[1].split(':')[0]}:
                            {index.demande.createdAt.split('T')[1].split(':')[1]}
                          </p>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
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
