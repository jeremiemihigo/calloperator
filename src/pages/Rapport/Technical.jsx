import { Search } from '@mui/icons-material';
import { Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { Input } from 'antd';
import axios from 'axios';
import ConfirmDialog from 'Control/ControlDialog';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { big_data_issue, config } from 'static/Lien';
import SelectedArray from 'static/Select';
import * as XLSX from 'xlsx';
import { generateNomFile } from './NameFile';
import './style.css';
import ExcelButton from './TwoFiles';

function Technical() {
  const [dates, setDates] = React.useState({ debut: '', fin: '' });
  const [provenance, setProvenance] = React.useState('');
  const agent = useSelector((state) => state.agent?.agent);
  const shop = useSelector((state) => state.shop?.shop);

  const [loading, setLoading] = React.useState(false);
  const { debut, fin } = dates;
  const [nomFile, setNomFile] = React.useState('');
  const [new_value, setNew_Value] = React.useState();
  const [old_value, setOld_Value] = React.useState();

  const generateFile = (datas, statut) => {
    let table = [];
    let donner = _.filter(datas, { isValide: statut });
    for (let i = 0; i < donner.length; i++) {
      table.push({
        ID: donner[i].codeclient,
        num_ticket: donner[i].idPlainte,
        customer_name: donner[i].nomClient,
        contact: donner[i].contact,
        dateSave: moment(donner[i].dateSave).format('DD/MM/YYYY'),
        submitedBy: donner[i].submitedBy,
        statut: donner[i].statut,
        Plainte: donner[i].typePlainte,
        Issue: donner[i].plainteSelect,
        shop: donner[i].shop,
        open: donner[i].open,
        decodeur: donner[i].decodeur,
        raisonOngoing: donner[i].raisonOngoing,
        EditRaison: donner[i].editRaison,
        EditBy: donner[i].editBy,
        delai: donner[i].delai,
        type: donner[i].type,
        desangagement_Raison: donner[i]?.desangagement?.raison,
        repo_volontaire_numsynchro: donner[i]?.repo_volontaire?.num_synchro,
        repo_volontaire_materiel: donner[i]?.repo_volontaire?.materiel,
        regularisation_jours: donner[i]?.regularisation?.jours,
        regularisation_cu: donner[i]?.regularisation?.cu,
        regularisation_date_coupure: donner[i]?.regularisation?.date_coupure,
        regularisation_raison: donner[i]?.regularisation?.raison,
        upgrade: donner[i]?.upgrade,
        downgrade_kit: donner[i]?.downgrade?.kit,
        downgrade_num_synchro: donner[i]?.downgrade?.num_synchro,
        provenance: donner[i]?.property,
        commentaire: donner[i].recommandation,
        verification: donner[i].verification?.nomAgent,
        verif_commentaire: donner[i].verification?.commentaire,
        assignBy: donner[i].technicien?.assignBy,
        codeTech: donner[i].technicien?.codeTech,
        numSynchro: donner[i].technicien?.numSynchro,
        Nom_Tech: returnNom(donner[i].technicien?.codeTech),
        'Date Assign': moment(donner[i].technicien?.date).format('DD/MM/YYYY'),
        'Heure Assign': moment(donner[i].technicien?.date).format('hh:mm'),
        commune: donner[i].adresse?.commune,
        quartier: donner[i].adresse?.quartier,
        avenue: donner[i].adresse?.avenue,
        SAT: donner[i].adresse?.sat?.nom_SAT,
        operation: donner[i].operation ? donner[i].operation : 'undefined'
      });
    }
    return table;
  };

  const searchData = async () => {
    setLoading(true);
    const response = await axios.post(
      big_data_issue + '/rapport_technical',
      {
        debut,
        fin,
        provenance
      },
      config
    );
    setLoading(false);
    if (response.data === 'token expired') {
      localStorage.removeItem('auth');
      window.location.replace('/login');
    }
    if (response.status === 200 && response.data.length > 0) {
      setNomFile(generateNomFile(dates, 'Complaints'));
      setNew_Value(generateFile(response.data, 'new_value'));
      setOld_Value(generateFile(response.data, 'old_value'));
    }
  };

  const returnNom = (id) => {
    return _.filter(agent, { codeAgent: id })[0]?.nom;
  };

  const Callcenter_support = (magasin) => {
    return _.filter(new_value, { operation: 'backoffice', shop: magasin });
  };
  const _Technical = (magasin) => {
    return _.filter(new_value, { type: 'ticket', operation: 'undefined', shop: magasin });
  };
  const _No_Technical = (magasin) => {
    return new_value.filter((x) => x.type === 'appel' && x.operation === 'undefined' && x.shop === magasin);
  };
  const _Total_New = (magasin) => {
    return _.filter(new_value, { shop: magasin });
  };
  const _Last_To_Date = (magasin) => {
    return _.filter(old_value, { shop: magasin });
  };
  const _VS_Last = (magasin) => {
    const this_month = _.filter(new_value, { shop: magasin }).length;
    const last_month = _.filter(old_value, { shop: magasin }).length;
    if (last_month === 0) {
      return '';
    } else {
      return ((this_month - last_month) / last_month).toFixed();
    }
  };
  const [confirmDialog, setConfirmDialog] = React.useState({
    isOpen: false,
    title: '',
    subTitle: ''
  });
  const exportComplaint = (complaint) => {
    try {
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false
      });
      const worksheet1 = XLSX.utils.json_to_sheet(complaint);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet1, 'complaint');
      XLSX.writeFile(workbook, 'complaint.xlsx');
    } catch (error) {
      console.log(error);
    }
  };
  const provenanceData = [
    { id: 0, value: 'shop', title: 'Shop' },
    { id: 1, value: 'callcenter', title: 'Call center' },
    { id: 2, value: 'shop,callcenter', title: 'Overall' }
  ];

  return (
    <>
      <Paper elevation={4} sx={{ padding: '10px' }}>
        <p style={{ fontWeight: 'bolder' }}>Complaints</p>
        <Grid container sx={{ marginTop: '10px' }}>
          <Grid item lg={2} sm={3} xs={12}>
            <SelectedArray label="Provenance" data={provenanceData} value={provenance} setValue={setProvenance} />
          </Grid>
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

          {!loading && new_value && (
            <Grid item lg={1} sm={1} xs={1} sx={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
              <ExcelButton data_now={new_value} data_two={old_value} fileName={`${nomFile}.xlsx`} />
            </Grid>
          )}
        </Grid>
      </Paper>
      <Paper elevation={3} sx={{ marginTop: '10px', padding: '10px' }}>
        <Grid container>
          <Grid item lg={12}>
            <table>
              <thead>
                <tr>
                  <td>Shop</td>
                  <td>Call center support</td>
                  <td>No technical Issue</td>
                  <td>Technical Issue</td>
                  <td>Total this month</td>
                  <td>Last month to day</td>
                  <td>VS Lastmonth</td>
                </tr>
              </thead>
              <tbody>
                {shop &&
                  new_value &&
                  new_value.length > 0 &&
                  shop.length > 0 &&
                  shop.map((index) => {
                    return (
                      <tr key={index._id}>
                        <td>{index?.shop}</td>
                        <Typography
                          component="td"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Do you want to export this file ?',
                              subTitle: '',
                              onConfirm: () => {
                                exportComplaint(Callcenter_support(index?.shop));
                              }
                            });
                          }}
                          className={`${Callcenter_support(index?.shop).length === 0 ? 'valueZero' : 'valueSuperieur'}`}
                        >
                          {Callcenter_support(index?.shop).length}
                        </Typography>
                        <Typography
                          component="td"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Do you want to export this file ?',
                              subTitle: '',
                              onConfirm: () => {
                                exportComplaint(_No_Technical(index?.shop));
                              }
                            });
                          }}
                          className={`${_No_Technical(index?.shop).length === 0 ? 'valueZero' : 'valueSuperieur'}`}
                        >
                          {_No_Technical(index?.shop).length}
                        </Typography>
                        <Typography
                          component="td"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Do you want to export this file ?',
                              subTitle: '',
                              onConfirm: () => {
                                exportComplaint(_Technical(index?.shop));
                              }
                            });
                          }}
                          className={`${_Technical(index?.shop).length === 0 ? 'valueZero' : 'valueSuperieur'}`}
                        >
                          {_Technical(index?.shop).length}
                        </Typography>
                        <Typography
                          component="td"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Do you want to export this file ?',
                              subTitle: '',
                              onConfirm: () => {
                                exportComplaint(_Total_New(index?.shop));
                              }
                            });
                          }}
                          className={`${_Total_New(index?.shop).length === 0 ? 'valueZero' : 'valueSuperieur'}`}
                        >
                          {_Total_New(index?.shop).length}
                        </Typography>
                        <Typography
                          component="td"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Do you want to export this file ?',
                              subTitle: '',
                              onConfirm: () => {
                                exportComplaint(_Last_To_Date(index?.shop));
                              }
                            });
                          }}
                          className={`${_Last_To_Date(index?.shop).length === 0 ? 'valueZero' : 'valueSuperieur'}`}
                        >
                          {_Last_To_Date(index?.shop).length}
                        </Typography>
                        <td className={`${_VS_Last(index?.shop) < 0 && 'colorRed'}`}>{_VS_Last(index?.shop)}%</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Grid>
        </Grid>
      </Paper>
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </>
  );
}

export default React.memo(Technical);
