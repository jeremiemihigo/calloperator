import { Send } from '@mui/icons-material';
import { Button, Divider, Grid, Paper, Typography } from '@mui/material';
import { TextField } from '@mui/material/';
import axios from 'axios';
import { CreateContexteGlobal } from 'GlobalContext';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_file, lien_issue, returnName, TimeCounter } from 'static/Lien';
import { CreateContexteTable } from '../Contexte';

function Conversation() {
  const { plainteSelect, setSelect } = React.useContext(CreateContexteTable);
  const { client, setClient } = React.useContext(CreateContexteGlobal);
  const user = useSelector((state) => state.user?.user);
  const [data, setData] = React.useState([]);
  const [content, setContent] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const sendMessage = async (e) => {
    try {
      e.preventDefault();
      setSending(true);
      const response = await axios.post(
        lien_issue + '/message',
        {
          idPlainte: plainteSelect?.idPlainte,
          content
        },
        config
      );
      if (response.status === 200) {
        setData([...data, response.data]);
        setSending(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    setData(plainteSelect?.message);
  }, [plainteSelect]);

  const returnTime = (date1, date2) => {
    let resultat = (new Date(date2).getTime() - new Date(date1).getTime()) / 60000;
    if (resultat < 1) {
      return 1;
    } else {
      return resultat;
    }
  };

  const changeStatus = async () => {
    try {
      const response = await axios.put(
        lien_issue + '/updateappel',
        {
          id: plainteSelect._id,
          data: {
            open: false,
            delai: plainteSelect.time_delai - returnTime(plainteSelect.fullDateSave, new Date()) > 0 ? 'IN SLA' : 'OUT SLA'
          }
        },
        config
      );
      if (response.status === 200) {
        setClient(client.map((x) => (x._id === response.data._id ? response.data : x)));
        setSelect(2);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Grid container sx={{ marginTop: '10px' }}>
        <Grid item lg={4} xs={12} sm={4} md={4}>
          <Paper>
            <Grid sx={{ padding: '5px', backgroundColor: '#002d72', color: '#fff' }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 'bolder' }} noWrap>
                {plainteSelect.nomClient}
              </Typography>
            </Grid>
            <Grid sx={{ padding: '5px' }}>
              <Grid className="month">{plainteSelect.codeclient}</Grid>
              <Grid container>
                <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
                  <Typography className="title">Type Plainte</Typography>
                  <Typography className="values">{plainteSelect.typePlainte}</Typography>
                </Grid>
                <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
                  <Typography className="title">Plainte</Typography>
                  <Typography className="values">{plainteSelect.plainteSelect}</Typography>
                </Grid>
                <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
                  <Typography className="title">Commentaire</Typography>
                  <Typography className="values">{plainteSelect.recommandation}</Typography>
                </Grid>
                <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
                  <Typography className="title">Delai</Typography>
                  <Typography className="values">{plainteSelect?.delai}</Typography>
                </Grid>
                <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
                  <Typography className="title">openBy</Typography>
                  <Typography className="values">{plainteSelect?.submitedBy}</Typography>
                </Grid>

                <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
                  <Typography className="title">statut</Typography>
                  <Typography className="values">{plainteSelect?.statut}</Typography>
                </Grid>
              </Grid>
              <Divider />
              <Grid container>
                <Grid item lg={12} xs={12} sm={12} md={12} className="grid">
                  <div>
                    {plainteSelect.statut === 'Desengagement' && (
                      <div className="downgrade">
                        <p className="downgradeP">Desengagement du client</p>
                        <p>
                          <span>Raison</span> : {plainteSelect?.desangagement?.raison}
                        </p>
                        <a rel="noreferrer" target="_blank" href={`${lien_file}/${plainteSelect?.desangagement?.filename}`}>
                          <span>ouvrir le contrat</span>
                        </a>
                      </div>
                    )}
                    {plainteSelect.statut === 'Downgrade' && (
                      <div className="downgrade">
                        <p className="downgradeP">Downgrade</p>
                        <p>
                          <span>num_synchro</span> : {plainteSelect?.downgrade?.num_synchro}
                        </p>
                        <p>
                          <span>kit</span> : {plainteSelect?.downgrade?.kit}
                        </p>
                      </div>
                    )}
                    {plainteSelect.statut === 'Repossession volontaire' && (
                      <div className="downgrade">
                        <p className="downgradeP">Repossession volontaire</p>
                        <p>
                          <span>num_synchro</span> : {plainteSelect?.repo_volontaire?.num_synchro}
                        </p>
                        <p>
                          <span>Materiels</span> :{' '}
                          {plainteSelect?.repo_volontaire.materiel.map((index) => {
                            return <span key={index}>{index}</span>;
                          })}
                        </p>
                      </div>
                    )}
                    {plainteSelect.statut === 'Upgrade' && (
                      <div className="downgrade">
                        <p className="downgradeP">Upgrade</p>
                        <p>
                          <span>Materiel</span> : {plainteSelect?.upgrade}
                        </p>
                      </div>
                    )}
                    {plainteSelect.statut === 'Regularisation' && (
                      <div className="downgrade">
                        <p className="downgradeP">Regularisation</p>
                        <p>
                          <span>Jours</span> : {plainteSelect?.regularisation?.jours} jour(s)
                        </p>
                        <p>
                          <span>C.U</span> : {plainteSelect?.regularisation?.cu}
                        </p>
                        <p>
                          <span>Raison</span> : {plainteSelect?.regularisation?.raison}
                        </p>
                        <p>
                          <span>date_coupure</span> : {moment(plainteSelect?.regularisation?.date_coupure).format('DD/MM/YYYY')}
                        </p>
                      </div>
                    )}
                    {plainteSelect.plainteSelect === 'Changement de Shop' && (
                      <div className="downgrade">
                        <p className="downgradeP">Changement de Shop</p>
                        <p>
                          <span>Shop</span> : {plainteSelect?.adresse?.shop}
                        </p>
                        <p>
                          <span>Commune</span> : {plainteSelect?.adresse?.commune}
                        </p>
                        <p>
                          <span>Quartier</span> : {plainteSelect?.adresse?.quartier}
                        </p>
                        <p>
                          <span>Avenue</span> : {plainteSelect?.adresse?.avenue}
                        </p>
                        <p>
                          <span>Reference</span> : {plainteSelect?.adresse?.reference}
                        </p>
                        <p>
                          <span>SAT</span> : {plainteSelect?.adresse?.sat?.nom_SAT}
                        </p>
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item lg={12} xs={12} sm={12} md={12} className="grid">
                  {plainteSelect?.open ? (
                    TimeCounter((plainteSelect.time_delai - returnTime(plainteSelect.fullDateSave, new Date())).toFixed(0))
                  ) : (
                    <p style={{ background: 'rgb(0, 169, 224)', color: 'white', padding: '10px', margin: '0px', textAlign: 'center' }}>
                      {plainteSelect?.delai}
                    </p>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          <Paper sx={{ padding: '10px', marginTop: '4px' }}>
            <div className="adresseInfo">
              <p className="adresseP">Customer Informations</p>
              {plainteSelect?.adresse?.contact && (
                <p>
                  <span>Contact</span>
                  {' : ' + plainteSelect?.adresse?.contact}
                </p>
              )}
              {plainteSelect?.decodeur && (
                <p>
                  <span>Décodeur</span>
                  {' : ' + plainteSelect?.decodeur}
                </p>
              )}
              {plainteSelect?.adresse?.commune && (
                <p>
                  <span>Commune </span>
                  {' : ' + plainteSelect?.adresse?.commune}
                </p>
              )}
              {plainteSelect?.adresse?.quartier && (
                <p>
                  <span>Quartier </span>
                  {' : ' + plainteSelect?.adresse?.quartier}
                </p>
              )}
              {plainteSelect?.adresse?.avenue && (
                <p>
                  <span>Avenue </span>
                  {' : ' + plainteSelect?.adresse?.avenue}
                </p>
              )}
              {plainteSelect?.adresse?.reference && (
                <p>
                  <span>Reference </span>
                  {' : ' + plainteSelect?.adresse?.reference}
                </p>
              )}
            </div>
          </Paper>
          <Paper sx={{ padding: '10px', marginTop: '4px' }}>
            {plainteSelect &&
              plainteSelect?.resultat.length > 0 &&
              plainteSelect?.resultat.map((index) => {
                return (
                  <div key={index._id} className="resultat">
                    <div>
                      <p>
                        <span>last_status : </span>
                        {index?.laststatus}
                      </p>
                      <p>
                        <span>change_to : </span>
                        {index?.changeto}
                      </p>
                      <p>
                        <span>Do_by : </span>
                        {index?.nomAgent}
                      </p>
                      <p>
                        <span>SLA : </span>
                        {index?.delai}
                      </p>
                      <p>
                        <span>Comment : </span>
                        {index?.commentaire}
                      </p>
                      <p>
                        <span>Date : </span>
                        {moment(index?.fullDate).format('DD/MM/YYYY hh:mm')}
                      </p>
                    </div>
                  </div>
                );
              })}
          </Paper>
        </Grid>
        <Grid item lg={8} xs={12} sm={8} md={8}>
          <Paper className="papierConv" elevation={3}>
            ID : {plainteSelect?.idPlainte}
          </Paper>
          <div>
            {data &&
              data.map((index) => {
                return (
                  <Paper elevation={3} key={index._id} className="papierConv">
                    <Grid container>
                      <Grid item lg={2} className="userP">
                        <div>
                          <Typography noWrap component="p">
                            {index.agent === user.nom ? 'Moi' : returnName(index.agent)}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item lg={10} className="body_content">
                        <p>{index.content}</p>
                      </Grid>
                    </Grid>
                  </Paper>
                );
              })}
          </div>
          {plainteSelect?.open ? (
            <div className="forme">
              <Grid container>
                <Grid item lg={6}>
                  <TextField onChange={(e) => setContent(e.target.value)} autoComplete="off" fullWidth label="Message" />
                </Grid>
                <Grid item lg={2} sx={{ paddingLeft: '5px' }}>
                  <Button disabled={sending} color="primary" variant="contained" onClick={(e) => sendMessage(e)}>
                    <Send fontSize="small" /> <span style={{ marginLeft: '10px' }}>Save</span>
                  </Button>
                </Grid>
                {user?.backOffice_plainte && (
                  <Grid item lg={4} sx={{ paddingLeft: '5px' }}>
                    <Button disabled={sending} color="primary" variant="contained" onClick={(e) => changeStatus(e)}>
                      Close
                    </Button>
                  </Grid>
                )}
              </Grid>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'red', fontWeight: 'bolder' }}>The_complaint_is_already_closed</p>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default Conversation;
