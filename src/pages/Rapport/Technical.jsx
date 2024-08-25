import { Search } from '@mui/icons-material';
import { Button, CircularProgress, Grid, Paper } from '@mui/material';
import { Input } from 'antd';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import ExcelButton from 'static/ExcelButton';
import { config, lien_issue } from 'static/Lien';
import moment from '../../../node_modules/moment/moment';
import { generateNomFile } from './NameFile';
import './style.css';

function Technical() {
  const [dates, setDates] = React.useState({ debut: '', fin: '' });
  const agent = useSelector((state) => state.agent?.agent);
  const [shop, setShop] = React.useState();
  const [allstatus, setStatus] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const { debut, fin } = dates;
  const [data, setData] = React.useState();
  const [nomFile, setNomFile] = React.useState('');

  const searchData = async () => {
    setLoading(true);
    const response = await axios.post(
      lien_issue + '/rapport_technical',
      {
        debut,
        fin
      },
      config
    );
    setLoading(false);
    if (response.data === 'token expired') {
      localStorage.removeItem('auth');
      window.location.replace('/login');
    }
    if (response.status === 200 && response.data.length > 0) {
      setStatus(Object.keys(_.groupBy(response.data, 'statut')));
      setShop(Object.keys(_.groupBy(response.data, 'shop')));
      setData(response.data);
    }
  };
  const returnNomber = (shops, statut) => {
    return _.filter(data, { statut: statut, shop: shops }).length;
  };

  const returnTotShop = (shops) => {
    return _.filter(data, { shop: shops }).length;
  };
  const returnNom = (id) => {
    return _.filter(agent, { codeAgent: id })[0]?.nom;
  };
  const [donner, setDonner] = React.useState();
  const generateFile = () => {
    let table = [];
    for (let i = 0; i < data.length; i++) {
      table.push({
        ID: data[i].codeclient,
        num_ticket: data[i].idPlainte,
        customer_name: data[i].nomClient,
        contact: data[i].contact,
        dateSave: moment(data[i].dateSave).format('DD/MM/YYYY'),
        submitedBy: data[i].submitedBy,
        statut: data[i].statut,
        Plainte: data[i].typePlainte,
        Issue: data[i].plainteSelect,
        shop: data[i].shop,
        provenance: data[i]?.property,
        commentaire: data[i].recommandation,
        verification: data[i].verification?.nomAgent,
        verif_commentaire: data[i].verification?.commentaire,
        assignBy: data[i].technicien?.assignBy,
        codeTech: data[i].technicien?.codeTech,
        numSynchro: data[i].technicien?.numSynchro,
        Nom_Tech: returnNom(data[i].technicien?.codeTech),
        'Date Assign': moment(data[i].technicien?.date).format('DD/MM/YYYY'),
        'Heure Assign': moment(data[i].technicien?.date).format('hh:mm'),
        commune: data[i].adresse?.commune,
        quartier: data[i].adresse?.quartier,
        avenue: data[i].adresse?.avenue,
        SAT: data[i].adresse?.sat?.nom_SAT
      });
    }
    setNomFile(generateNomFile(dates, 'Technical Issue'));
    setDonner(table);
  };
  React.useEffect(() => {
    if (data && data.length > 0) {
      generateFile();
    }
  }, [data]);
  return (
    <>
      <Paper elevation={4} sx={{ padding: '10px' }}>
        <p style={{ fontWeight: 'bolder' }}>Technical Issue</p>
        <Grid container sx={{ marginTop: '10px' }}>
          <Grid item lg={2} sm={3} xs={12} sx={{ display: 'flex', alignItems: 'center', marginTop: '5px', padding: '0px 5px' }}>
            <Input
              type="date"
              onChange={(e) =>
                setDates({
                  ...dates,
                  debut: e.target.value
                })
              }
              placeholder="Date"
            />
          </Grid>
          <Grid item lg={2} sm={3} xs={12} sx={{ marginTop: '5px', display: 'flex', alignItems: 'center', paddingRight: '5px' }}>
            <Input
              onChange={(e) =>
                setDates({
                  ...dates,
                  fin: e.target.value
                })
              }
              type="date"
              placeholder="Date"
            />
          </Grid>
          <Grid item lg={1} sm={1} xs={1} sx={{ marginTop: '5px', display: 'flex', alignItems: 'center', paddingRight: '5px' }}>
            <Button disabled={loading} fullWidth color="primary" variant="contained" onClick={() => searchData()}>
              {loading ? <CircularProgress size={12} /> : <Search fontSize="small" />}
            </Button>
          </Grid>

          {!loading && donner && (
            <Grid item lg={1} sm={1} xs={1} sx={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
              <ExcelButton data={donner} title="" fileName={`${nomFile}.xlsx`} />
            </Grid>
          )}
        </Grid>
      </Paper>
      <Paper elevation={3} sx={{ marginTop: '10px', padding: '10px' }}>
        <Grid container>
          <Grid item lg={6}>
            <table>
              <thead>
                <tr>
                  <td>Shop/Statut</td>
                  <td>Ticket</td>
                </tr>
              </thead>
              <tbody>
                {shop &&
                  allstatus &&
                  shop.map((index) => {
                    return (
                      <React.Fragment key={index._id}>
                        <tr>
                          <td style={{ backgroundColor: '#dedede' }}>{index}</td>
                          <td style={{ backgroundColor: '#dedede' }}>{returnTotShop(index)}</td>
                        </tr>
                        {allstatus.map((item) => {
                          return (
                            <tr key={item}>
                              <td>{item}</td>
                              <td>{returnNomber(index, item)}</td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default React.memo(Technical);
