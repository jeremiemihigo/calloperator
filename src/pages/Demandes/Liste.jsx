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
import { big_data, config } from 'static/Lien';
import { CreateContexteDemande } from './ContextDemande';
import ListeDemandeFeedBack from './DemandeFeedback';
import './style.css';

function DemandeListe() {
  const { setDemande, demande, data, setResetData, allListe, setAllListe, setData } = useContext(CreateContexteGlobal);

  const agent = useSelector((state) => state.agent.agent);
  const zone = useSelector((state) => state.zone.zone);

  const returnAgent = (id, key) => {
    if (agent && agent.length > 0) {
      if (key === 'shop') {
        return _.filter(agent, { codeAgent: id })[0]?.shop[0]?.shop;
      } else {
        return _.filter(agent, { codeAgent: id })[0]?.nom;
      }
    } else {
      return '';
    }
  };
  const returnZone = (id) => {
    if (zone && zone.length > 0) {
      return _.filter(zone, { idZone: id })[0]?.denomination;
    } else {
      return '';
    }
  };

  const [error, setError] = React.useState('');
  const [chargement, setChargement] = React.useState(false);

  const loadings = async () => {
    try {
      setChargement(true);
      const response = await axios.get(`${big_data}/toutesDemandeAttente/100`, config);
      if (response.status === 201 && response.data === 'token expired') {
        localStorage.removeItem('auth');
        window.location.replace('/login');
      } else {
        setData(_.groupBy(response.data, 'codeZone'));
        setAllListe(response.data);
        setChargement(false);
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
    // Set an interval to call 'loadings()' every 5 minutes (300000 ms)
    const intervalId = setInterval(() => {
      loadings();
    }, 200000); // 300000 ms = 5 minutes

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const postId = useSelector((state) => state.reponse?.postId);
  React.useEffect(() => {
    if (data && allListe) {
      let donners = allListe.filter((x) => x.idDemande !== postId);
      setData(_.groupBy(donners, 'codeZone'));
    }
  }, [postId]);
  const [regionSelect, setRegionSelect] = React.useState('');
  const { changeRecent, changeImages } = useContext(CreateContexteDemande);

  const onselect = (items) => {
    changeRecent();
    setDemande(items);
    changeImages();
    setResetData(items._id);
  };

  const ListeDemande = () => {
    return (
      <>
        {chargement && allListe.length === 0 && <p style={{ textAlign: 'center', fontSize: '12px' }}>Chargement...</p>}

        {!chargement && allListe.length === 0 && <NoCustomer texte="No pending requests" />}
        {data &&
          Object.keys(data).map((index) => {
            return (
              <div key={index}>
                <Grid className="regionDemande" onClick={() => setRegionSelect(index)}>
                  <p>
                    {returnZone(index)} <span className="nombre">{data['' + index].length || 0}</span>
                  </p>
                </Grid>
                {regionSelect === index &&
                  data['' + index].map((items, cle) => {
                    return (
                      <Card
                        onClick={() => onselect(items)}
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
                            {returnAgent(items.codeAgent, 'shop')};{' '}
                            {items.codeclient && items.codeclient !== 'undefined' && items.codeclient} {items.statut} {items.codeAgent}
                          </p>
                          <p style={{ fontSize: '9px' }}>
                            {returnAgent(items.codeAgent, 'nom')}
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
