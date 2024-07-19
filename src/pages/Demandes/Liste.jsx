/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, Grid } from '@mui/material';
import { CreateContexte } from 'Context';
import TabComponent from 'Control/Tabs';
import { CreateContexteGlobal } from 'GlobalContext';
import { Alert } from 'antd';
import axios from 'axios';
import LoaderGif from 'components/LoaderGif';
import _ from 'lodash';
import moment from 'moment';
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';
import { config, lien } from 'static/Lien';
import ListeDemandeFeedBack from './DemandeFeedback';
import './style.css';

function DemandeListe() {
  const { setDemande, demande } = useContext(CreateContexte);

  const [data, setData] = React.useState();
  const [error, setError] = React.useState('');

  const loadings = async () => {
    try {
      const response = await axios.get(`${lien}/toutesDemandeAttente`, config);
      if (response.status === 201 && response.data === 'token expired') {
        localStorage.removeItem('auth');
        window.location.replace('/login');
      } else {
        setData(response.data);
        setError('');
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        setError('Rassurez-vous que votre appareil a une connexion active');
      }
    }
  };

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     loadings();
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, []);
  React.useEffect(() => {
    loadings();
  }, []);

  const { socket } = useContext(CreateContexteGlobal);
  const [datasocket, setDatasocket] = React.useState();
  React.useEffect(() => {
    if (socket) {
      socket.on('demande', (donner) => {
        if (donner.length > 0) {
          setDatasocket(donner[0]);
        }
      });
    }
  }, [socket]);
  React.useEffect(() => {
    if (datasocket) {
      setData([...data, datasocket]);
    }
  }, [datasocket]);

  // const [afterDelete, setAfter] = React.useState();

  // React.useEffect(() => {
  //   if (socket) {
  //     socket.on('reponseEmit', (donner) => {
  //       if (donner.type === 'success') {
  //         setAfter(donner.content);
  //       }
  //     });
  //   }
  // }, [socket]);
  // React.useEffect(() => {
  //   if (donnes) {
  //     let donner = donnes.filter((x) => x.idDemande !== afterDelete);
  //     setDonner(donner);
  //     setData(_.groupBy(donner, 'zone.denomination'));

  //     if (demande && demande.idDemande === afterDelete) {
  //       setDemande();
  //     }
  //     setAfter();
  //   }
  // }, [afterDelete]);

  const postId = useSelector((state) => state.reponse?.postId);
  React.useEffect(() => {
    if (data) {
      let donner = data.filter((x) => x.idDemande !== postId);
      setData(donner);
    }
  }, [postId]);

  const [regionSelect, setRegionSelect] = React.useState('');

  const [reponse, setReponse] = React.useState();
  React.useEffect(() => {
    if (socket) {
      socket.on('reponse', (donner) => {
        if (donner) {
          setReponse(donner);
        }
      });
    }
  }, [socket]);
  React.useEffect(() => {
    if (reponse) {
      let nouvelle = data.filter((x) => x.idDemande !== reponse.idDemande);
      setData(nouvelle);
      if (demande.idDemande === reponse.idDemande) {
        setDemande();
      }
    }
  }, [reponse]);

  const ListeDemande = () => {
    return (
      <>
        {data && data.length === 0 && (
          <p style={{ fontSize: '12px', textAlign: 'center', color: 'blue', fontWeight: 'bolder' }}>Aucune demande en attente</p>
        )}
        {data &&
          Object.keys(_.groupBy(data, 'zone.denomination')).map((index) => {
            return (
              <div key={index}>
                <Grid className="regionDemande" onClick={() => setRegionSelect(index)}>
                  <p>
                    {index} <span className="nombre">{_.groupBy(data, 'zone.denomination')['' + index].length}</span>{' '}
                  </p>
                </Grid>
                {regionSelect === index &&
                  _.groupBy(data, 'zone.denomination')['' + index].map((e, cle) => {
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
                            {e.shopAgent[0]?.shop}; {e.codeclient && e.codeclient !== 'undefined' && e.codeclient} {e.statut}{' '}
                            {e.agent.codeAgent}
                          </p>
                          <p style={{ fontSize: '9px' }}>
                            {e.agent.nom}
                            <span style={{ float: 'right' }}>{moment(e.createdAt).fromNow()}</span>
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
      <Helmet>{data && <title>({'' + data.length}) demandes</title>}</Helmet>
      {error !== '' && <Alert type="warning" message={error} />}

      {!data ? <LoaderGif width={150} height={150} /> : <TabComponent titres={title} components={component} />}
    </>
  );
}

export default DemandeListe;
