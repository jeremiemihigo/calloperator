/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, Grid } from '@mui/material';
import TabComponent from 'Control/Tabs';
import { CreateContexteGlobal } from 'GlobalContext';
import { Alert } from 'antd';
import axios from 'axios';
import NoCustomer from 'components/Attente';
import _ from 'lodash';
import moment from 'moment';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { config, lien } from 'static/Lien';
import ListeDemandeFeedBack from './DemandeFeedback';
import './style.css';

function DemandeListe() {
  const { setDemande, demande, data, allListe, setAllListe, setData } = useContext(CreateContexteGlobal);

  const [error, setError] = React.useState('');

  const loadings = async () => {
    try {
      const response = await axios.get(`${lien}/toutesDemandeAttente`, config);
      if (response.status === 201 && response.data === 'token expired') {
        localStorage.removeItem('auth');
        window.location.replace('/login');
      } else {
        setData(_.groupBy(response.data, 'zone.denomination'));
        setAllListe(response.data);
        setError('');
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        setError('Rassurez-vous que votre appareil a une connexion active');
      }
    }
  };

  React.useEffect(() => {
    loadings();
  }, []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      loadings();
    }, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const postId = useSelector((state) => state.reponse?.postId);
  React.useEffect(() => {
    if (data && allListe) {
      let donners = allListe.filter((x) => x.idDemande !== postId);
      setData(_.groupBy(donners, 'zone.denomination'));
    }
  }, [postId]);
  const [regionSelect, setRegionSelect] = React.useState('');

  const ListeDemande = () => {
    return (
      <>
        {allListe && allListe.length === 0 && <NoCustomer texte="No pending requests" />}
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
                  data['' + index].map((items, cle) => {
                    return (
                      <Card
                        onClick={() => setDemande(items)}
                        style={{
                          cursor: 'pointer',
                          padding: '5px',
                          marginBottom: '4px'
                        }}
                        key={cle}
                        className={demande && demande._id === items._id ? 'colorGreen' : ''}
                      >
                        <div className="allP">
                          <p>
                            {' '}
                            {items.shopAgent[0]?.shop}; {items.codeclient && items.codeclient !== 'undefined' && items.codeclient}{' '}
                            {items.statut} {items.agent.codeAgent}
                          </p>
                          <p style={{ fontSize: '9px' }}>
                            {items.agent.nom}
                            <span style={{ float: 'right' }}>{moment(items.createdAt).fromNow()}</span>
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
    { id: 0, label: 'En_attente' },
    { id: 1, label: 'Non_conforme' }
  ];
  const component = [
    { id: 0, component: <ListeDemande /> },
    { id: 1, component: <ListeDemandeFeedBack setError={setError} /> }
  ];

  return (
    <>
      {error !== '' && <Alert type="warning" message={error} />}

      {/* {allListe && allListe.length > 0 ? (
        <TabComponent titres={title} components={component} />
      ) : (
        <NoCustomer texte="No pending requests" />
      )} */}
      <TabComponent titres={title} components={component} />
    </>
  );
}

export default DemandeListe;
