import { Button, CircularProgress, Grid, Paper } from '@mui/material';
import { Input } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien } from 'static/Lien';
import { Skeleton } from '../../../node_modules/@mui/material/index';
import Dot from './Dot';
import './analyse.style.css';

function Analyse() {
  const [data, setData] = React.useState();
  const [load, setLoad] = React.useState(false);
  const regions = useSelector((state) => state.zone.zone);
  const [date, setDates] = React.useState('');

  const loading = async (today) => {
    setDates(today ? today : date);
    try {
      if (date !== '' || today) {
        setLoad(true);
        const response = await axios.post(lien + '/analyseVisites', { date: today ? today : date }, config);
        if (response.status === 200) {
          setData(response.data);
          setLoad(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    loading(moment(new Date().setDate(new Date().getDate() - 1)).format('YYYY-MM-DD'));
  }, []);

  //filter = agent ou tech ou total general
  //type = last_month or this_month
  //entite = region ou shop,
  //id_entity = ID de l'entite
  const returnMTD = (filter, type, entite, id_entity) => {
    if (filter === 'total' && entite === 'region') {
      return _.filter(data['' + type], { idZone: id_entity }).length.toString();
    }
    if (filter === 'total' && entite === 'shop') {
      return _.filter(data['' + type], { idShop: id_entity }).length.toString();
    }
    if (filter === 'agent' && entite === 'region') {
      return _.filter(data['' + type], { idZone: id_entity, fonction: 'agent' }).length.toString();
    }
    if (filter === 'tech' && entite === 'region') {
      return _.filter(data['' + type], { idZone: id_entity, fonction: 'tech' }).length.toString();
    }
    if (filter === 'agent' && entite === 'shop') {
      return _.filter(data['' + type], { idShop: id_entity, fonction: 'agent' }).length.toString();
    }
    if (filter === 'tech' && entite === 'shop') {
      return _.filter(data['' + type], { idShop: id_entity, fonction: 'tech' }).length.toString();
    }
  };
  const returnGap = (filter, entite, id_entity) => {
    const { this_month, last_month } = data;
    if (this_month.length === 0) {
      return -100;
    } else {
      if (filter === 'total' && entite === 'region') {
        const thisM = _.filter(this_month, { idZone: id_entity }).length;
        const lastM = _.filter(last_month, { idZone: id_entity }).length;
        const nombre = thisM === 0 ? -100 : (((thisM - lastM) * 100) / thisM).toFixed(0);
        return nombre;
      }
      if (filter === 'total' && entite === 'shop') {
        const thisM = _.filter(this_month, { idShop: id_entity }).length;
        const lastM = _.filter(last_month, { idShop: id_entity }).length;
        const nombre = thisM === 0 ? -100 : (((thisM - lastM) * 100) / thisM).toFixed(0);
        return nombre;
      }
      if (filter === 'agent' && entite === 'region') {
        const thisM = _.filter(this_month, { idZone: id_entity, fonction: 'agent' }).length;
        const lastM = _.filter(last_month, { idZone: id_entity, fonction: 'agent' }).length;
        const nombre = thisM === 0 ? -100 : (((thisM - lastM) * 100) / thisM).toFixed(0);
        return nombre;
      }
      if (filter === 'agent' && entite === 'shop') {
        const thisM = _.filter(this_month, { idShop: id_entity, fonction: 'agent' }).length;
        const lastM = _.filter(last_month, { idShop: id_entity, fonction: 'agent' }).length;
        const nombre = thisM === 0 ? -100 : (((thisM - lastM) * 100) / thisM).toFixed(0);
        return nombre;
      }
      if (filter === 'tech' && entite === 'region') {
        const thisM = _.filter(this_month, { idZone: id_entity, fonction: 'agent' }).length;
        const lastM = _.filter(last_month, { idZone: id_entity, fonction: 'agent' }).length;
        const nombre = thisM === 0 ? -100 : (((thisM - lastM) * 100) / thisM).toFixed(0);
        return nombre;
      }
      if (filter === 'tech' && entite === 'shop') {
        const thisM = _.filter(this_month, { idShop: id_entity, fonction: 'tech' }).length;
        const lastM = _.filter(last_month, { idShop: id_entity, fonction: 'tech' }).length;
        const nombre = thisM === 0 ? -100 : (((thisM - lastM) * 100) / thisM).toFixed(0);
        return nombre;
      }
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid container>
          <Grid item lg={6} xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ padding: '0px', fontWeight: 'bolder', margin: '0px', fontSize: '12px' }}>
              COMPARAISON DES VISITES EN MONTH TO DATE DES AGENTS ET TECHNICIENS
            </p>
          </Grid>
          <Grid item lg={4} xs={12} sx={{ padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Input value={date} onChange={(e) => setDates(e.target.value)} type="date" placeholder="Date" />
          </Grid>
          <Grid item lg={2} xs={12} sx={{ padding: '5px' }}>
            <Button disabled={load} fullWidth color="primary" variant="contained" onClick={() => loading()}>
              {load ? <CircularProgress size={15} color="inherit" sx={{ textAlign: 'center' }} /> : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={3}>
        {data && !load && (
          <table>
            <thead>
              <tr>
                <td rowSpan="2" style={{ fontSize: '12px', textAlign: 'center' }}>
                  REGION & SHOP
                </td>

                <td colSpan="3" style={{ textAlign: 'center', fontSize: '12px' }}>
                  VISITES PA
                </td>
                <td colSpan="3" style={{ textAlign: 'center', fontSize: '12px' }}>
                  VISITE TECHNICIENS
                </td>
                <td colSpan="3" style={{ textAlign: 'center', fontSize: '12px' }}>
                  TOTAL GENERAL
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: '12px' }}>
                  MTD AU <br /> {moment(data.lastDate).format('DD MMM YYYY')}
                </td>
                <td style={{ fontSize: '12px' }}>
                  MTD AU
                  <br /> {moment(data.today).format('DD MMM YYYY')}
                </td>

                <td style={{ textAlign: 'center', fontSize: '12px' }}>GAP</td>
                <td style={{ fontSize: '12px' }}>
                  MTD AU
                  <br /> {moment(data.lastDate).format('DD MMM YYYY')}
                </td>
                <td style={{ fontSize: '12px' }}>
                  MTD AU
                  <br /> {moment(data.today).format('DD MMM YYYY')}
                </td>
                <td style={{ textAlign: 'center', fontSize: '12px' }}>GAP</td>
                <td style={{ fontSize: '12px' }}>
                  MTD AU
                  <br /> {moment(data.lastDate).format('DD MMM YYYY')}
                </td>
                <td style={{ fontSize: '12px' }}>
                  MTD AU
                  <br /> {moment(data.today).format('DD MMM YYYY')}
                </td>
                <td style={{ textAlign: 'center', fontSize: '12px' }}>GAP</td>
              </tr>
            </thead>
            <tbody>
              {regions &&
                regions.map((index) => {
                  return (
                    <React.Fragment key={index._id}>
                      <tr style={{ backgroundColor: '#dedede' }}>
                        <td>{index.denomination}</td>
                        <td>{returnMTD('agent', 'last_month', 'region', index.idZone)}</td>
                        <td>{returnMTD('agent', 'this_month', 'region', index.idZone)}</td>
                        <td>
                          <Dot nombre={returnGap('agent', 'region', index.idZone)} />
                        </td>
                        <td>{returnMTD('tech', 'last_month', 'region', index.idZone)}</td>
                        <td>{returnMTD('tech', 'this_month', 'region', index.idZone)}</td>
                        <td>
                          {' '}
                          <Dot nombre={returnGap('tech', 'region', index.idZone)} />
                        </td>
                        <td>{returnMTD('total', 'last_month', 'region', index.idZone)}</td>
                        <td>{returnMTD('total', 'this_month', 'region', index.idZone)}</td>
                        <td>
                          <Dot nombre={returnGap('total', 'region', index.idZone)} />
                        </td>
                      </tr>
                      {index.shop.map((item) => {
                        return (
                          <tr key={item._id}>
                            <td>{item.shop}</td>

                            <td>{returnMTD('agent', 'last_month', 'shop', item.idShop)}</td>
                            <td>{returnMTD('agent', 'this_month', 'shop', item.idShop)}</td>
                            <td>
                              <Dot nombre={returnGap('agent', 'shop', item.idShop)} />
                            </td>
                            <td>{returnMTD('tech', 'last_month', 'shop', item.idShop)}</td>
                            <td>{returnMTD('tech', 'this_month', 'shop', item.idShop)}</td>
                            <td>
                              <Dot nombre={returnGap('tech', 'shop', item.idShop)} />
                            </td>
                            <td>{returnMTD('total', 'last_month', 'shop', item.idShop)}</td>
                            <td>{returnMTD('total', 'this_month', 'shop', item.idShop)}</td>
                            <td>
                              <Dot nombre={returnGap('total', 'shop', item.idShop)} />
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              <tr>
                <td>Total General</td>

                <td className="blackcolor">{_.filter(data.last_month, { fonction: 'agent' }).length}</td>
                <td className="blackcolor">{_.filter(data.this_month, { fonction: 'agent' }).length}</td>

                <td>
                  {data.this_month.length === 0 ? (
                    <Dot nombre={-100} />
                  ) : (
                    <Dot
                      nombre={(
                        ((_.filter(data.this_month, { fonction: 'agent' }).length -
                          _.filter(data.last_month, { fonction: 'agent' }).length) *
                          100) /
                        _.filter(data.last_month, { fonction: 'agent' }).length
                      ).toFixed(0)}
                    />
                  )}
                </td>
                <td className="blackcolor">{_.filter(data.last_month, { fonction: 'tech' }).length}</td>
                <td className="blackcolor">{_.filter(data.this_month, { fonction: 'tech' }).length}</td>

                <td>
                  {data.this_month.length === 0 ? (
                    <Dot nombre={-100} />
                  ) : (
                    <Dot
                      nombre={(
                        ((_.filter(data.this_month, { fonction: 'tech' }).length - _.filter(data.last_month, { fonction: 'tech' }).length) *
                          100) /
                        _.filter(data.last_month, { fonction: 'tech' }).length
                      ).toFixed(0)}
                    />
                  )}
                </td>
                <td className="blackcolor">{data.last_month.length}</td>
                <td className="blackcolor">{data.this_month.length}</td>
                <td>
                  {data.this_month.length === 0 ? (
                    <Dot nombre={-100} />
                  ) : (
                    <Dot nombre={(((data.this_month.length - data.last_month.length) * 100) / data.last_month.length).toFixed(0)} />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )}
        {regions && regions.length > 0 && load && (
          <table>
            <thead>
              <tr>
                <td rowSpan="2" style={{ fontSize: '12px', textAlign: 'center' }}>
                  REGION & SHOP
                </td>

                <td colSpan="3" style={{ textAlign: 'center', fontSize: '12px' }}>
                  VISITES PA
                </td>
                <td colSpan="3" style={{ textAlign: 'center', fontSize: '12px' }}>
                  VISITE TECHNICIENS
                </td>
                <td colSpan="3" style={{ textAlign: 'center', fontSize: '12px' }}>
                  TOTAL GENERAL
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: '12px' }}>
                  MTD AU <br /> {moment(new Date(date).setMonth(new Date(date).getMonth() - 1)).format('DD MMM YYYY')}
                </td>
                <td style={{ fontSize: '12px' }}>
                  MTD AU
                  <br /> {moment(new Date(date)).format('DD MMM YYYY')}
                </td>

                <td style={{ textAlign: 'center', fontSize: '12px' }}>GAP</td>
                <td style={{ fontSize: '12px' }}>
                  MTD AU <br /> {moment(new Date(date).setMonth(new Date(date).getMonth() - 1)).format('DD MMM YYYY')}
                </td>
                <td style={{ fontSize: '12px' }}>
                  MTD AU
                  <br /> {moment(new Date(date)).format('DD MMM YYYY')}
                </td>
                <td style={{ textAlign: 'center', fontSize: '12px' }}>GAP</td>

                <td style={{ fontSize: '12px' }}>
                  MTD AU <br /> {moment(new Date(date).setMonth(new Date(date).getMonth() - 1)).format('DD MMM YYYY')}
                </td>
                <td style={{ fontSize: '12px' }}>
                  MTD AU
                  <br /> {moment(new Date(date)).format('DD MMM YYYY')}
                </td>
                <td style={{ textAlign: 'center', fontSize: '12px' }}>GAP</td>
              </tr>
            </thead>
            <tbody>
              {regions &&
                regions.map((index) => {
                  return (
                    <React.Fragment key={index._id}>
                      <tr style={{ backgroundColor: '#dedede' }}>
                        <td>{index.denomination}</td>
                        <td>
                          <Skeleton variant="text" sx={{ width: '100%' }} />
                        </td>
                        <td>
                          <Skeleton variant="text" sx={{ width: '100%' }} />
                        </td>
                        <td>
                          <Skeleton variant="text" sx={{ width: '100%' }} />
                        </td>
                        <td>
                          <Skeleton variant="text" sx={{ width: '100%' }} />
                        </td>
                        <td>
                          <Skeleton variant="text" sx={{ width: '100%' }} />
                        </td>
                        <td>
                          <Skeleton variant="text" sx={{ width: '100%' }} />
                        </td>
                        <td>
                          <Skeleton variant="text" sx={{ width: '100%' }} />
                        </td>
                        <td>
                          <Skeleton variant="text" sx={{ width: '100%' }} />
                        </td>
                        <td>
                          <Skeleton variant="text" sx={{ width: '100%' }} />
                        </td>
                      </tr>
                      {index.shop.map((item) => {
                        return (
                          <tr key={item._id}>
                            <td>{item.shop}</td>

                            <td>
                              <Skeleton variant="text" sx={{ width: '100%' }} />
                            </td>
                            <td>
                              <Skeleton variant="text" sx={{ width: '100%' }} />
                            </td>
                            <td>
                              <Skeleton variant="text" sx={{ width: '100%' }} />
                            </td>
                            <td>
                              <Skeleton variant="text" sx={{ width: '100%' }} />
                            </td>
                            <td>
                              <Skeleton variant="text" sx={{ width: '100%' }} />
                            </td>
                            <td>
                              <Skeleton variant="text" sx={{ width: '100%' }} />
                            </td>
                            <td>
                              <Skeleton variant="text" sx={{ width: '100%' }} />
                            </td>
                            <td>
                              <Skeleton variant="text" sx={{ width: '100%' }} />
                            </td>
                            <td>
                              <Skeleton variant="text" sx={{ width: '100%' }} />
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              <tr>
                <td>Total General</td>

                <td>
                  <Skeleton variant="text" sx={{ width: '100%' }} />
                </td>
                <td>
                  <Skeleton variant="text" sx={{ width: '100%' }} />
                </td>

                <td>
                  <Skeleton variant="text" sx={{ width: '100%' }} />
                </td>
                <td>
                  <Skeleton variant="text" sx={{ width: '100%' }} />
                </td>
                <td>
                  <Skeleton variant="text" sx={{ width: '100%' }} />
                </td>

                <td>
                  <Skeleton variant="text" sx={{ width: '100%' }} />
                </td>
                <td>
                  <Skeleton variant="text" sx={{ width: '100%' }} />
                </td>
                <td>
                  <Skeleton variant="text" sx={{ width: '100%' }} />
                </td>
                <td>
                  <Skeleton variant="text" sx={{ width: '100%' }} />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </Paper>
    </>
  );
}

export default Analyse;
