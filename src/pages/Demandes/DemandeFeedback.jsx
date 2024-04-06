/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React from 'react';
import { Card } from '@mui/material';
import moment from 'moment';
import { CreateContexte } from 'Context';
import axios from 'axios';
import { lien, config } from 'static/Lien';
import { Grid } from '../../../node_modules/@mui/material/index';
import { Input } from 'antd';
import Chat from './Chat';

function ListeDemandeFeedBack({ setError }) {
  const { setDemande } = React.useContext(CreateContexte);
  const [dataChat, setDatachat] = React.useState([]);
  const [load, setLoad] = React.useState(false);

  const loading = async () => {
    try {
      setLoad(true);
      setDatachat([]);
      const response = await axios.get(lien + '/demandeIncorrect', config);
      if (response.status === 200) {
        setDatachat(response.data);
        setLoad(false);
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        setLoad(false);
        setError('Rassurez-vous que votre appareil a une connexion active');
      }
    }
  };
  React.useEffect(() => {
    loading();
  }, []);

  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    }
  });
  const handleChanges = (e) => {
    let target = e.target.value.toLowerCase();

    setFilterFn({
      fn: (items) => {
        if (target === '') {
          return items;
        } else {
          return items.filter((x) => x.idDemande.includes(target));
        }
      }
    });
  };

  return (
    <div className="listeDemandeFeedback">
      <Grid container>
        <Grid item lg={12} sx={{ paddingRight: '10px' }}>
          <Input onChange={(e) => handleChanges(e)} placeholder="Cherchez un message" />
        </Grid>
      </Grid>
      {load && <p style={{ textAlign: 'center', fontWeight: 'bolder' }}>Please wait...</p>}

      {dataChat &&
        filterFn.fn(dataChat).map((index) => {
          return (
            <div key={index._id}>
              <Card
                onClick={(event) => {
                  event.preventDefault();
                  setDemande(index);
                }}
                style={{
                  cursor: 'pointer',
                  padding: '5px',
                  marginBottom: '4px'
                }}
              >
                <div className="allP">
                  <p>
                    {' '}
                    {index.idDemande}; {index.codeclient && index.codeclient}{' '}
                  </p>
                  <p>
                    {index.statut}; {index.raison && index.raison}
                  </p>

                  <p style={{ fontSize: '9px', width: '100%' }}>
                    <span>{index.agent?.nom}</span>
                    <span style={{ float: 'right' }}>{moment(index.createdAt).fromNow()}</span>
                  </p>
                </div>
                <div>
                  <Chat demandes={index.conversation} />
                </div>
              </Card>
            </div>
          );
        })}
    </div>
  );
}
export default ListeDemandeFeedBack;
