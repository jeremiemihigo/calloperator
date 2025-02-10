import { Divider, Grid, Paper, Typography } from '@mui/material';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { lien_file, TimeCounter } from 'static/Lien';
import './style.css';

function DetailPlaintesRapport({ plainteSelect }) {
  const user = useSelector((state) => state.user?.user);
  const [data, setData] = React.useState([]);

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

  return (
    <>
      <Grid container sx={{ marginTop: '10px' }}>
        <Grid item lg={4} xs={12} sm={4} md={4}>
          <Paper>
            <Grid sx={{ padding: '10px', backgroundColor: 'rgb(0, 169, 224)', color: '#fff' }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 'bolder' }} noWrap>
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
                          <span>date_coupure</span> : {moment(plainteSelect?.regularisation?.date_coupure).format('DD/MM/YYYY')}
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
            ID complaint : {plainteSelect?.idPlainte}
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
                            {index.agent === user.nom ? 'Moi' : index.agent}
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
        </Grid>
      </Grid>
    </>
  );
}
DetailPlaintesRapport.propTypes = {
  plainteSelect: PropTypes.object
};
export default React.memo(DetailPlaintesRapport);
