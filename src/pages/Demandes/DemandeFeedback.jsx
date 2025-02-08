/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, Grid, TextField } from '@mui/material';
import { CreateContexteGlobal } from 'GlobalContext';
import axios from 'axios';
import moment from 'moment';
import React from 'react';
import { config, lien } from 'static/Lien';
import Chat from './Chat';

function ListeDemandeFeedBack({ setError }) {
  const { setDemande } = React.useContext(CreateContexteGlobal);
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
          return items.filter(
            (x) => x.idDemande.includes(e.target.value.toLowerCase()) || x.codeAgent.includes(e.target.value.toUpperCase())
          );
        }
      }
    });
  };
  return (
    <div className="listeDemandeFeedback">
      <Grid container>
        <Grid item lg={12} sm={12} xs={12} sx={{ margin: '10px' }}>
          <TextField disabled={load} onChange={(e) => handleChanges(e)} fullWidth label="ID visite ou ID agent" />
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
                    <span style={{ float: 'right' }}>{moment(index.updatedAt).fromNow()}</span>
                  </p>
                </div>

                {index?.typeVisit?.followup === 'followup' && (
                  <div style={{ margin: '0px', background: '#4684D3', padding: '4px', borderRadius: '10px' }}>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#FFFFFF',
                        padding: '0px',
                        margin: '0px'
                      }}
                    >
                      Ce client a déjà été en date du {moment(index?.typeVisit?.dateFollowup).format('DD-MM-YYYY à hh:mm')} par le meme
                      agent
                    </p>
                  </div>
                )}
                {index.conversation.length > 0 && (
                  <div>
                    <Chat demandes={index.conversation} />
                  </div>
                )}
              </Card>
            </div>
          );
        })}
    </div>
  );
}
export default ListeDemandeFeedBack;
