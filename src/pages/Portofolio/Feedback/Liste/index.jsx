import { Card, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, portofolio } from 'static/Lien';
import { ContextFeedback } from '../Context';
import './liste.css';

function Index() {
  const statut = ['Unreachable', 'Pending', 'Reachable', 'Remind'];
  const status = ['late', 'default'];
  const [statu, setStatus] = React.useState('Overall');
  const [etat, setEtat] = React.useState('Overall');
  const [shopselect, setShopSelect] = React.useState('');
  const [load, setLoad] = React.useState(false);

  const projet = useSelector((state) => state.projet.projet);
  const { projetSelect, setProjetSelect, client, setClient, data, setData } = React.useContext(ContextFeedback);
  const fetchData = async () => {
    try {
      setLoad(true);
      setData([]);
      let fetc = etat === 'Overall' ? ['Unreachable', 'Pending', 'Reachable', 'Remind'] : [etat];
      let sta = statu === 'Overall' ? ['late', 'default'] : [statu];
      const response = await axios.post(
        portofolio + '/client',
        { etat, filter: { shop: shopselect, status: { $in: sta }, idProjet: projetSelect, etat: { $in: fetc } } },
        config
      );
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (shopselect !== '' && projetSelect !== '') {
      fetchData();
    }
  }, [shopselect, projetSelect, etat, statu]);
  const shop = useSelector((state) => state.shop.shop);

  return (
    <div>
      {shop && projet && (
        <Card sx={{ padding: '4px', marginBottom: '10px' }}>
          <div className="select__">
            <select
              style={{ width: '60%', padding: '5px', border: 'none' }}
              onChange={(event) => setProjetSelect(event.target.value)}
              value={projetSelect}
            >
              <option value="">Projet-----</option>
              {projet.map((index) => {
                return (
                  <option value={index.id} key={index.id}>
                    {index.title}
                  </option>
                );
              })}
            </select>
            <select
              style={{ width: '40%', padding: '5px', border: 'none' }}
              onChange={(event) => setStatus(event.target.value)}
              value={statu}
            >
              <option value="Overall">Overall</option>
              {status.map((index) => {
                return (
                  <option value={index} key={index}>
                    {index}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="select__">
            <select
              style={{ width: '60%', padding: '5px', border: 'none' }}
              onChange={(event) => setShopSelect(event.target.value)}
              value={shopselect}
            >
              <option value="">Shop-----</option>
              {shop.map((index) => {
                return (
                  <option value={index.shop} key={index._id}>
                    {index.shop}
                  </option>
                );
              })}
            </select>
            <select style={{ width: '40%', padding: '5px', border: 'none' }} onChange={(event) => setEtat(event.target.value)} value={etat}>
              <option value="Overall">Overall</option>
              {statut.map((index) => {
                return (
                  <option value={index} key={index}>
                    {index}
                  </option>
                );
              })}
            </select>
          </div>

          <Typography noWrap style={{ padding: '0px', fontSize: '12px', margin: '0px', color: 'rgb(0, 169, 254)', fontWeight: 'bolder' }}>
            {data.length > 1
              ? data.length + ' clients pour le shop de ' + shopselect
              : data.length + ' client pour le shop de ' + shopselect}
          </Typography>
        </Card>
      )}
      <div className="feedback_liste">
        {load && (
          <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bolder', color: 'blue' }} className="f_item">
            Loading...
          </p>
        )}
        {!load &&
          data.length > 0 &&
          data.map((index) => {
            return (
              <Grid
                className={client && client._id === index._id ? 'client_select f_item' : 'f_item'}
                onClick={() => setClient(index)}
                key={index._id}
              >
                <p className="customer_id">{index.codeclient}</p>
                <Typography noWrap component="p" className="customer_name">
                  {index.customer_name.toUpperCase()}
                </Typography>
                <p className="customer_shop">
                  <span>{index.shop}</span>
                  <span className={index.etat}>{index.etat}</span>
                </p>
              </Grid>
            );
          })}
      </div>
    </div>
  );
}

export default Index;
