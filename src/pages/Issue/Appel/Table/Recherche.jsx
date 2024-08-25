import { Search, SearchOutlined } from '@mui/icons-material';
import { Button, Divider, FormControl, Grid, InputAdornment, OutlinedInput, Paper, Typography } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { config, lien_file, lien_issue, returnName } from 'static/Lien';
import { useSelector } from '../../../../../node_modules/react-redux/es/exports';

function Recherche() {
  const [value, setValue] = React.useState('');
  const user = useSelector((state) => state.user.user);
  const [plainteSelect, setData] = React.useState();
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 5
    });
  };

  const loading = async (e) => {
    e.preventDefault();
    setData();
    const response = await axios.get(lien_issue + '/onecomplaint/' + value, config);
    if (response.status === 200) {
      setData(response.data[0]);
    } else {
      success('' + response.data, 'error');
    }
  };
  return (
    <>
      {contextHolder}
      <Paper elevation={2} sx={{ padding: '10px' }}>
        <Grid container>
          <Grid item lg={8}>
            <FormControl sx={{ width: '100%' }}>
              <OutlinedInput
                size="small"
                id="header-search"
                startAdornment={
                  <InputAdornment position="start" sx={{ mr: -0.5 }}>
                    <SearchOutlined />
                  </InputAdornment>
                }
                aria-describedby="header-search-text"
                inputProps={{
                  'aria-label': 'weight'
                }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                // onKeyUp={(e) => postData(e)}
                placeholder="ID Complaint"
              />
            </FormControl>

            {/* <Input label="Recherche" setValue, value={value} showIcon type="text" value={value} onChange={(e) => key(e)} onKeyUp={(e) => postData(e)} placeholder="Account ID" /> */}
          </Grid>
          <Grid item lg={2} sx={{ paddingLeft: '10px' }}>
            <Button onClick={(e) => loading(e)} variant="contained" color="primary">
              <Search fontSize="small" /> Recherche
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {plainteSelect && (
        <Grid container>
          <Grid item lg={7} xs={12} sm={4} md={4}>
            <Paper>
              <Grid sx={{ padding: '5px', backgroundColor: '#002d72', color: '#fff' }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 'bolder' }} noWrap>
                  {plainteSelect.nomClient} {plainteSelect?.open ? '(Open)' : '(Closed)'}
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
                    <Typography className="title">Month</Typography>
                    <Typography className="values">{plainteSelect?.periode}</Typography>
                  </Grid>
                  <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
                    <Typography className="title">Last update</Typography>
                    <Typography className="values">{moment(plainteSelect?.fullDateSave).format('DD-MM-YYYY hh:mm')}</Typography>
                  </Grid>
                  <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
                    <Typography className="title">Origin</Typography>
                    <Typography className="values">{plainteSelect?.property}</Typography>
                  </Grid>
                  <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
                    <Typography className="title">Date close</Typography>
                    <Typography className="values">{plainteSelect?.dateClose}</Typography>
                  </Grid>
                  <Grid item lg={6} xs={12} sm={12} md={12} className="grid">
                    <Typography className="title">Type</Typography>
                    <Typography className="values">{plainteSelect?.type}</Typography>
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
                plainteSelect?.resultat?.length > 0 &&
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
          <Grid item lg={5}>
            <div>
              {plainteSelect?.message &&
                plainteSelect?.message.map((index) => {
                  return (
                    <Paper elevation={2} key={index._id} className="papierConv">
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
                          <p style={{ fontSize: '10px' }}>{moment(index.createdAt).fromNow()}</p>
                        </Grid>
                      </Grid>
                    </Paper>
                  );
                })}
            </div>
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default Recherche;
