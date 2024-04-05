/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, Grid } from '@mui/material';
import './style.css';
import React, { useContext, useEffect } from 'react';
import { lien, config } from 'static/Lien';
import moment from 'moment';
import { CreateContexte } from 'Context';
import axios from 'axios';
import _ from 'lodash';
import TabComponent from 'Control/Tabs';
import { Alert } from 'antd';
import ListeDemandeFeedBack from './DemandeFeedback';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

function DemandeListe() {
  const { setDemande, demande } = useContext(CreateContexte);
  const [data, setData] = React.useState([]);
  const [donnes, setDonner] = React.useState([]);
  const [error, setError] = React.useState('');
  const postId = useSelector((state) => state.reponse?.postId);

  const loadings = async () => {
    try {
      const response = await axios.get(`${lien}/toutesDemandeAttente`, config);
      if (response.status === 201 && response.data === 'token expired') {
        localStorage.removeItem('auth');
        window.location.replace('/login');
      } else {
        setDonner(response.data);
        setData(_.groupBy(response.data, 'zone.denomination'));
        setError('');
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        setError('Rassurez-vous que votre appareil a une connexion active');
      }
    }
  };
  useEffect(() => {
    let donner = donnes.filter((x) => x.idDemande !== postId);
    setData(_.groupBy(donner, 'zone.denomination'));
  }, [postId]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadings();
    }, 30000);
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
                        className={demande && demande._id === e._id ? 'colorGreen' : ''}
                      >
                        <div className="allP">
                          <p>
                            {' '}
                            {e.shopAgent?.shop}; {e.codeclient && e.codeclient !== 'undefined' && e.codeclient} {e.statut}{' '}
                            {e.agent.codeAgent}
                          </p>

                          <p style={{ fontSize: '9px' }}>
                            {e.agent.nom}
                            <span style={{ fontSize: '9px', float: 'right' }}>{moment(e.createdAt).fromNow()}</span>
                          </p>
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

  const title = [
    { id: 0, label: 'En attente' },
    { id: 1, label: 'Non conforme' }
  ];
  const component = [
    { id: 0, component: <ListeDemande /> },
    { id: 1, component: <ListeDemandeFeedBack setError={setError} /> }
  ];

  return (
    <>
      <Helmet>
        <title>({'' + donnes.length}) demandes</title>
      </Helmet>
      {error !== '' && <Alert type="warning" message={error} />}

      <TabComponent titres={title} components={component} />
    </>
  );
}

export default React.memo(DemandeListe);
