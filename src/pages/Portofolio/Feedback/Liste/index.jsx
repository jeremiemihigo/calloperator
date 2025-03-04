import React from 'react';
import { useSelector } from 'react-redux';
import { config, portofolio } from 'static/Lien';
import { Card, Typography } from '../../../../../node_modules/@mui/material/index';
import axios from '../../../../../node_modules/axios/index';
import './liste.css';

function Index() {
  const [shopselect, setShopSelect] = React.useState('');
  const [load, setLoad] = React.useState(false);
  const [data, setData] = React.useState([]);
  const fetchData = async () => {
    try {
      setLoad(true);
      setData([]);
      const response = await axios.post(portofolio + '/client', { filter: { shop: shopselect } }, config);
      if (response.status === 200) {
        setData(response.data);
        setLoad(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (shopselect !== '') {
      fetchData();
    }
  }, [shopselect]);
  const shop = useSelector((state) => state.shop.shop);

  return (
    <div>
      {shop && (
        <Card sx={{ padding: '4px', marginBottom: '10px' }}>
          <select
            style={{ width: '100%', padding: '5px', border: 'none' }}
            onChange={(event) => setShopSelect(event.target.value)}
            value={shopselect}
          >
            {shop.map((index) => {
              return (
                <option value={index.shop} key={index._id}>
                  {index.shop}
                </option>
              );
            })}
          </select>
          <Typography noWrap style={{ padding: '0px', fontSize: '12px', margin: '0px', color: 'rgb(0, 169, 254)', fontWeight: 'bolder' }}>
            {data.length > 1 ? data.length + ' clients pour le shop de ' + shopselect : data.length + ' client'}
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
              <div className="f_item" key={index._id}>
                <p className="customer_id">{index.codeclient}</p>
                <Typography noWrap component="p" className="customer_name">
                  {index.customer_name.toUpperCase()}
                </Typography>
                <p className="customer_shop">{index.shop}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Index;
