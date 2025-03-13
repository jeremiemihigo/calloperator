import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import Popup from 'static/Popup';
import { Typography } from '../../../../node_modules/@mui/material/index';
import Formulaire from './Formulaire';

function Index() {
  const agentadmin = useSelector((state) => state.agentAdmin?.agentAdmin.filter((x) => x.validateShop && x.validateShop.length > 0));
  const shop = useSelector((state) => state.shop.shop);
  const returnshop = (id) => {
    return _.filter(shop, { idShop: id })[0].shop;
  };
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Typography
        component="p"
        onClick={() => setOpen(true)}
        style={{
          color: 'blue',
          padding: '0px',
          margin: '10px 0px',
          cursor: 'pointer'
        }}
      >
        Ajoutez
      </Typography>
      <table>
        <thead>
          <tr>
            <td>Staff</td>
            <td>Shop</td>
          </tr>
        </thead>
        <tbody>
          {agentadmin &&
            shop &&
            agentadmin.map((index) => {
              return (
                <tr key={index._id}>
                  <td>{index.nom}</td>
                  <td>
                    {index.validateShop.map((item, key) => {
                      return <span key={key}>{returnshop(item)}; </span>;
                    })}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <Popup open={open} setOpen={setOpen} title="Add">
        <Formulaire />
      </Popup>
    </div>
  );
}

export default Index;
