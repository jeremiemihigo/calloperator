import { Grid, Paper, Typography } from '@mui/material';
import Dot from 'components/@extended/Dot';
import LoaderGif from 'components/LoaderGif';
import { CreateContexteGlobal } from 'GlobalContext';
import _ from 'lodash';
import React from 'react';
import { returnTime } from 'static/Lien';
import { useSelector } from '../../../../../node_modules/react-redux/es/exports';
import { useNavigate } from '../../../../../node_modules/react-router-dom/dist/index';
import RadialBarChart from '../Dashboard/Chart';

function ThisMonth_Tech() {
  const [data, setData] = React.useState();
  const { client } = React.useContext(CreateContexteGlobal);

  const loading = () => {
    if (client) {
      setData(client.filter((x) => x.type === 'ticket'));
    }
  };
  React.useEffect(() => {
    loading();
  }, [client]);

  const [graphique, setGraphique] = React.useState({
    attente: [],
    encours: [],
    callcenter: []
  });
  const { attente, encours, callcenter } = graphique;
  React.useEffect(() => {
    if (data) {
      setGraphique({
        attente: data.filter((x) => x.technicien === undefined),
        encours: data.filter((x) => x.statut === 'Open_technician_visit' && x.technicien !== undefined),
        callcenter: data.filter((x) => x.statut === 'resolved_awaiting_confirmation')
      });
    }
  }, [data]);
  const [dataChart, setDataChart] = React.useState();
  React.useEffect(() => {
    if (data) {
      const result = data.filter((x) => x.statut === 'Open_technician_visit' && x.technicien !== undefined);
      const codeTech = Object.keys(_.groupBy(result, 'technicien.codeTech'));
      let tableValue = [];
      codeTech.forEach((code) => {
        tableValue.push({
          code,
          result: result.filter((x) => x.technicien.codeTech === code),
          taille: result.filter((x) => x.technicien.codeTech === code).length
        });
      });
      tableValue.sort((a, b) => b.taille - a.taille);
      setDataChart(tableValue);
    }
  }, [data]);

  function TimeCounterDelai(row) {
    const time = (row.time_delai - returnTime(row.fullDateSave, new Date()).toFixed(0)) * 60;
    if (time <= 0) {
      return 'OUT SLA';
    } else {
      return 'IN SLA';
    }
  }

  const ReturnDelai = (delai, type, donner) => {
    if (type === 'attente') {
      let d = donner ? donner : data;
      const result = d.filter((x) => x.technicien === undefined);
      let nombre = 0;
      let pourcentage = 0;
      for (let i = 0; i < result.length; i++) {
        if (TimeCounterDelai(result[i]) === delai) {
          nombre = nombre + 1;
        }
      }
      pourcentage = (nombre * 100) / result.length;
      return pourcentage.toFixed(0) + '%';
    }
    if (type === 'encours') {
      let d = donner ? donner : data;
      const result = d.filter((x) => x.statut === 'Open_technician_visit' && x.technicien !== undefined);
      let nombre = 0;
      let pourcentage = 0;
      for (let i = 0; i < result.length; i++) {
        if (TimeCounterDelai(result[i]) === delai) {
          nombre = nombre + 1;
        }
      }
      pourcentage = (nombre * 100) / result.length;
      return isNaN(pourcentage) ? '0%' : pourcentage.toFixed(0) + '%';
    }
    if (type === 'callcenter') {
      let d = donner ? donner : data;
      const result = d.filter((x) => x.statut === 'resolved_awaiting_confirmation');
      let nombre = 0;
      let pourcentage = 0;
      for (let i = 0; i < result.length; i++) {
        if (TimeCounterDelai(result[i]) === delai) {
          nombre = nombre + 1;
        }
      }
      pourcentage = (nombre * 100) / result.length;
      return pourcentage.toFixed(0) + '%';
    }
  };
  const navigation = useNavigate();
  const openDataTech = (e, data) => {
    e.preventDefault();
    navigation('/tech_value', { state: data });
  };
  const agent = useSelector((state) => state.agent?.agent);
  const returnName = (id) => {
    if (agent) {
      return _.filter(agent, { codeAgent: id })[0]?.nom;
    } else {
      return id;
    }
  };
  return (
    <>
      <Grid container>
        {!data && <LoaderGif width={300} height={300} />}
        {data && (
          <>
            <Grid item lg={3} xs={12} sm={6} md={4} sx={{ padding: '2px' }}>
              <Paper onClick={(e) => openDataTech(e, 'technicien')} elevation={3} sx={style.paper}>
                <Typography component="p" sx={style.padding0}>
                  Waiting for a technician
                  <Typography
                    component="span"
                    sx={{ fontSize: '11px', cursor: 'pointer', color: 'blue', fontWeight: 'bolder' }}
                  >{` Détails`}</Typography>
                </Typography>
                <RadialBarChart nombre={attente.length} texte="Unaffected" />
                {data && data.length > 0 && (
                  <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Dot color="error" />
                      <p style={{ padding: '0px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>
                        {ReturnDelai('OUT SLA', 'attente')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', marginLeft: '20px', alignItems: 'center', justifyContent: 'center' }}>
                      <Dot color="success" />
                      <p style={{ padding: '0px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>
                        {ReturnDelai('IN SLA', 'attente')}
                      </p>
                    </div>
                  </div>
                )}
              </Paper>
            </Grid>
            <Grid item lg={3} xs={12} sm={6} md={4} sx={{ padding: '2px' }}>
              <Paper onClick={(e) => openDataTech(e, 'encours')} elevation={3} sx={style.paper}>
                <Typography component="p" sx={style.padding0}>
                  Running{' '}
                  <Typography
                    component="span"
                    sx={{ fontSize: '11px', cursor: 'pointer', color: 'blue', fontWeight: 'bolder' }}
                  >{` Détails`}</Typography>
                </Typography>
                <RadialBarChart nombre={((encours.length * 100) / data.length).toFixed(0)} texte="Running" />
                {data && data.length > 0 && (
                  <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Dot color="error" />
                      <p style={{ padding: '0px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>
                        {ReturnDelai('OUT SLA', 'encours')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', marginLeft: '20px', alignItems: 'center', justifyContent: 'center' }}>
                      <Dot color="success" />
                      <p style={{ padding: '0px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>
                        {ReturnDelai('IN SLA', 'encours')}
                      </p>
                    </div>
                  </div>
                )}
              </Paper>
            </Grid>
            <Grid item lg={3} xs={12} sm={6} md={4} sx={{ padding: '2px' }}>
              <Paper onClick={(e) => openDataTech(e, 'callcenter')} elevation={3} sx={style.paper}>
                <Typography component="p" sx={style.padding0}>
                  Awaiting verification{' '}
                  <Typography component="span" sx={{ fontSize: '11px', cursor: 'pointer', color: 'blue', fontWeight: 'bolder' }}>
                    Détails
                  </Typography>
                </Typography>
                <RadialBarChart nombre={((callcenter.length * 100) / data.length).toFixed(0)} texte="Waiting at CC" />
                {data && data.length > 0 && (
                  <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Dot color="error" />
                      <p style={{ padding: '0px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>
                        {ReturnDelai('OUT SLA', 'callcenter')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', marginLeft: '20px', alignItems: 'center', justifyContent: 'center' }}>
                      <Dot color="success" />
                      <p style={{ padding: '0px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>
                        {ReturnDelai('IN SLA', 'callcenter')}
                      </p>
                    </div>
                  </div>
                )}
              </Paper>
            </Grid>
          </>
        )}

        <Grid item lg={3} xs={12} sm={6} md={4} sx={{ padding: '2px' }}>
          <Paper elevation={3} sx={style.paper}>
            <p style={style.padding0}>This Month</p>
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ padding: '0px', margin: '0px' }}>Work in progress...</p>
            </div>
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={2} sx={{ padding: '10px', margin: '10px' }}>
        <p style={{ padding: '0px', margin: '0px' }}>Technician with more intervention waiting</p>
      </Paper>
      <Grid container>
        {dataChart &&
          dataChart.map((index) => {
            return (
              <Grid key={index.code} item lg={3} xs={6} sm={4} md={4} sx={{ padding: '2px' }}>
                <Paper className="paperNumber" onClick={(e) => openDataTech(e, index.code)} sx={{ cursor: 'pointer', padding: '5px' }}>
                  <Typography sx={style.name} noWrap>
                    {returnName(index.code)}
                  </Typography>
                  <Typography sx={style.code} noWrap>
                    {index.code}
                  </Typography>
                  <Typography sx={style.number} className="numberTech" noWrap>
                    {index.result.length}
                  </Typography>
                  <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Dot color="error" size={5} />
                      <p style={{ padding: '0px', fontSize: '10px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>
                        {ReturnDelai('OUT SLA', 'encours', index.result)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', marginLeft: '20px', alignItems: 'center', justifyContent: 'center' }}>
                      <Dot color="success" size={5} />
                      <p style={{ padding: '0px', fontSize: '10px', margin: '0px', marginLeft: '5px', fontWeight: 'bolder' }}>
                        {ReturnDelai('IN SLA', 'encours', index.result)}
                      </p>
                    </div>
                  </div>
                </Paper>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
}

const style = {
  padding0: {
    padding: '0px',
    margin: '0px',
    textAlign: 'center'
  },
  name: { textAlign: 'center', fontWeight: 'bolder', fontSize: '10px' },
  code: { textAlign: 'center', fontSize: '10px' },
  number: {
    textAlign: 'center',
    fontWeight: 'bolder',
    fontSize: '20px'
  },
  paper: {
    padding: '10px',
    height: '100%'
  },
  subTitle: {
    padding: '0px',
    margin: '0px',
    textAlign: 'center',
    fontSize: '10px'
  },
  view: {
    textAlign: 'right',
    padding: '0px',
    margin: '0px',
    fontSize: '10px',
    cursor: 'pointer',
    color: 'blue',
    fontWeight: 'bolder'
  }
};

export default React.memo(ThisMonth_Tech);
