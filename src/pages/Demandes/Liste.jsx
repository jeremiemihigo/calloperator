/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, Grid } from '@mui/material';
import './style.css';
import React, { useContext, useEffect } from 'react';
import { lien } from 'static/Lien';
import moment from 'moment';
import { CreateContexte } from 'Context';
import axios from 'axios';
import _ from 'lodash';
import TabComponent from 'Control/Tabs';
import { Alert } from 'antd';

function DemandeListe() {
  const { setDemande, demande, setChat } = useContext(CreateContexte);
  const [data, setData] = React.useState([]);
  const [dataChat, setDataChat] = React.useState();
  const [error, setError] = React.useState('');

  const loadings = async () => {
    try {
      const response = await axios.get(`${lien}/toutesDemandeAttente`);

      if (response.data) {
        setDataChat(_.filter(response.data.response, { feedback: 'chat' }));
        setChat(response.data.reclamation);
      }
      let donner = _.filter(response.data.response, { feedback: 'new' });
      setData(_.groupBy(donner, 'zone.denomination'));
      setError('');
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        setError('Rassurez-vous que votre appareil a une connexion active');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      loadings();
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const [regionSelect, setRegionSelect] = React.useState('');
  const ListeDemande = () => {
    return (
      <>
        {data &&
          Object.keys(data).map((index) => {
            return (
              <div key={index}>
                <Grid className="regionDemande" onClick={() => setRegionSelect(index)}>
                  <p>
                    {index} <span className="nombre">{data['' + index].length}</span>{' '}
                  </p>
                </Grid>
                {regionSelect === index &&
                  data['' + index].map((e, cle) => {
                    return (
                      <Card
                        onClick={(event) => {
                          event.stopPropagation();
                          setDemande(e);
                        }}
                        style={{
                          cursor: 'pointer',
                          padding: '5px',
                          marginBottom: '4px'
                        }}
                        key={cle}
                        className={demande && demande._id === e._id && 'colorGreen'}
                      >
                        <div className="allP">
                          <p>
                            {' '}
                            {e.idDemande}; {e.codeclient && e.codeclient} {e.statut}
                          </p>

                          <p style={{ fontSize: '9px', textAlign: 'right' }}>{moment(e.createdAt).fromNow()}</p>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            );
          })}
      </>
    );
  };

  const ListeDemandeFeedBack = () => {
    return (
      <div className="listeDemandeFeedback">
        {dataChat &&
          dataChat.map((index) => {
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

                    <p style={{ fontSize: '9px', textAlign: 'right' }}>{moment(index.createdAt).fromNow()}</p>
                  </div>
                  <div>
                    {index.conversation?.map((item) => {
                      return (
                        <div key={item._id} className={item.sender === 'co' ? 'messageCo' : 'messageAgent'}>
                          <p style={{ margin: '0px' }}>{item.message}</p>
                          <p style={{ margin: '0px' }} className="alignLeft">
                            {moment(item.createdAt).fromNow()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            );
          })}
      </div>
    );
  };

  const title = [
    { id: 0, label: 'En attente' },
    { id: 1, label: 'Non conforme' }
  ];
  const component = [
    { id: 0, component: <ListeDemande /> },
    { id: 1, component: <ListeDemandeFeedBack feedback={dataChat} /> }
  ];

  return (
    <>
      {error !== '' && <Alert type="warning" message={error} />}

      <TabComponent titres={title} components={component} />
    </>
  );
}

export default React.memo(DemandeListe);
