import { Divider, Grid, Paper, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { lien_file } from 'static/Lien';
import Popup from 'static/Popup';
import Form from '../Form';

function InfoCustomer({ plainteSelect }) {
  const [open, setOpen] = React.useState(false);
  const navigation = useNavigate();

  const openNavigate = (e) => {
    e.preventDefault();
    navigation('/edit', { state: plainteSelect });
  };
  return (
    <Paper sx={{ marginTop: '10px' }}>
      <Grid sx={{ padding: '5px', display: 'flex', alignItems: 'center', minHeight: '3rem', backgroundColor: '#002d72', color: '#fff' }}>
        <Typography sx={{ fontSize: '15px', padding: '0px', margin: '0px', fontWeight: 'bolder' }} noWrap>
          {plainteSelect.nomClient}{' '}
          <span style={{ background: `${plainteSelect?.open ? 'green' : 'red'}`, borderRadius: '5px', padding: '4px' }}>
            {plainteSelect?.open ? 'Open' : 'Closed'}
          </span>
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
          <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
            <Typography className="title">contact</Typography>
            <Typography className="values">{plainteSelect?.contact}</Typography>
          </Grid>
          <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
            <Typography className="title">Date</Typography>
            <Typography className="values">{moment(plainteSelect?.createdAt).format('DD-MM-YYYY')} </Typography>
          </Grid>
          <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
            <Typography className="title">Origin</Typography>
            <Typography className="values">{plainteSelect?.property}</Typography>
          </Grid>
          <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
            <Typography className="title">Shop</Typography>
            <Typography className="values">{plainteSelect?.shop}</Typography>
          </Grid>
          <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
            <Typography className="title">Type</Typography>
            <Typography className="values">{plainteSelect?.type}</Typography>
          </Grid>
          {plainteSelect?.decodeur && (
            <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
              <Typography className="title">Décodeur</Typography>
              <Typography className="values">{plainteSelect?.decodeur}</Typography>
            </Grid>
          )}
          {plainteSelect.statut === 'ongoing' && (
            <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
              <Typography className="title">Why ongoing ? </Typography>
              <Typography className="values">{plainteSelect?.raisonOngoing}</Typography>
            </Grid>
          )}
          {plainteSelect?.closeBy && (
            <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
              <Typography className="title">CloseBy ? </Typography>
              <Typography className="values">{plainteSelect?.closeBy}</Typography>
            </Grid>
          )}
          {plainteSelect?.editRaison && (
            <>
              <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
                <Typography className="title">Why he want to edit ? </Typography>
                <Typography className="values">{plainteSelect?.editRaison}</Typography>
                <Typography
                  component="p"
                  onClick={(e) => openNavigate(e)}
                  style={{
                    cursor: 'pointer',
                    fontSize: '12px',
                    textDecoration: 'underline',
                    marginTop: '10px',
                    color: 'blue',
                    fontWeight: 'bolder'
                  }}
                >
                  Clic here to make change
                </Typography>
              </Grid>
            </>
          )}
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
        </Grid>
      </Grid>
      {open && (
        <Popup open={open} setOpen={setOpen} title="Edit">
          <Form update={plainteSelect} />
        </Popup>
      )}
    </Paper>
  );
}

export default React.memo(InfoCustomer);
