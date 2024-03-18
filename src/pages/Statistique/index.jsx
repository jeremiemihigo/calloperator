/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import '../style.css';
import { useSelector } from 'react-redux';
import AutoComplement from 'Control/AutoComplet';
import _ from 'lodash';
import { Alert, Button, Grid, Card } from '@mui/material';
import { Search } from '@mui/icons-material';
import Graphique from './Graphique';
import axios from 'axios';
import { lien, config } from 'static/Lien';
import BasicTabs from 'Control/Tabs';
import MainCard from 'components/MainCard';
import Regions from './Regions';
import Agents from './Agents';
import AffichageStat from './AffichageStat';

function Statistiques() {
  const region = useSelector((state) => state.zone);
  const [value, setValue] = React.useState('');

  const agent = useSelector((state) => state.agent);
  const [agentRegion, setAgentRegion] = React.useState();
  const fetchAgent = () => {
    if (agent.agent) {
      const fetc = _.filter(agent.agent, {
        codeZone: value ? value.idZone : ''
      });
      setAgentRegion(fetc);
    }
  };
  React.useEffect(() => {
    fetchAgent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const [lot, setLot] = React.useState();
  const [agentSelect, setAgentSelect] = React.useState();
  const periode = useSelector((state) => state.periodeStore);

  const click = (e, index) => {
    e.preventDefault();

    if (lot && lot == index) {
      setLot();
    } else {
      setLot(index);
    }
  };

  const [donner, setDonner] = React.useState();
  const [error, setError] = React.useState({ message: '', valeur: false });
  const { valeur, message } = error;
  const sendDataFectch = (e) => {
    e.preventDefault();
    const donner = {
      region: value ? value.idZone : undefined,
      agent: agentSelect ? agentSelect.codeAgent : undefined,
      paquet: lot ? lot : undefined
    };
    const { region, agent, paquet } = donner;
    if (!region && !agent && !paquet) {
      setError({
        valeur: true,
        message: 'Veuillez choisir un critere de selection'
      });
    } else {
      setError({ valeur: false, message: '' });
      let sended = {};
      if (donner.agent !== undefined) {
        sended.codeAgent = donner.agent;
      }
      if (donner.region !== undefined) {
        sended.codeZone = donner.region;
      }
      if (donner.paquet !== undefined) {
        sended.lot = donner.paquet;
      }
      setDonner(sended);
    }
  };

  const [listeDemande, setListeDemande] = React.useState();
  const loadingDemandes = async () => {
    try {
      axios.post(lien + '/demandeAgentAll', donner, config).then((response) => {
        if (response.data === 'token expired') {
          localStorage.removeItem('auth');
          window.location.replace('/login');
        } else {
          setListeDemande(response.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (donner) {
      loadingDemandes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donner]);

  const titres = [
    { id: 0, label: 'Graphique' },
    { id: 1, label: 'Régions' },
    { id: 2, label: 'Agents' }
  ];

  return (
    <MainCard>
      {valeur && <Alert severity="error">{message}</Alert>}
      <Grid container sx={{ margin: '10px' }}>
        <Grid item lg={6}>
          <Grid container>
            <Grid item lg={4}>
              <AutoComplement value={value} setValue={setValue} options={region.zone} title="Selectionnez la region" propr="denomination" />
            </Grid>
            <Grid item lg={8} sx={{ paddingLeft: '5px' }}>
              {agentRegion && (
                <AutoComplement value={agentSelect} setValue={setAgentSelect} options={agentRegion} title="Agent" propr="nom" />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid lg={6} sx={{ paddingLeft: '5px' }}>
          <Grid container>
            {periode.getPeriode === 'success' &&
              periode.periode.length > 0 &&
              periode.periode.map((index) => {
                return (
                  <Grid lg={3} key={index._id} onClick={(e) => click(e, index._id)}>
                    <Card
                      style={lot === index._id ? style.lotGreen : style.lotWhite}
                      sx={{ textAlign: 'center', marginRight: '4px', cursor: 'pointer' }}
                    >
                      {index._id}
                    </Card>
                  </Grid>
                );
              })}
            <Grid item lg={3} sx={{ marginTop: '3px' }}>
              <Button color="primary" variant="contained" onClick={(e) => sendDataFectch(e)}>
                <Search fontSize="small" /> <span style={{ marginLeft: '5px' }}>Recherche</span>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item lg={12}>
          {listeDemande && (
            <Grid>
              <AffichageStat listeDemande={listeDemande} />
              <BasicTabs
                titres={titres}
                components={[
                  { id: 0, component: <Graphique donner={listeDemande} recherche={donner} /> },
                  { id: 1, component: <Regions listeDemande={listeDemande} /> },
                  { id: 2, component: <Agents listeDemande={listeDemande} /> }
                ]}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
    </MainCard>
  );
}
const style = {
  agentListe: {
    backgroundColor: '#dedede',
    marginTop: '5px',
    borderRadius: '10px',
    padding: '5px',
    cursor: 'pointer',
    width: '98%'
  },
  agentListeSelect: {
    backgroundColor: '#d9fdd3',
    marginTop: '5px',
    borderRadius: '10px',
    padding: '5px',
    cursor: 'pointer',
    width: '98%'
  },
  lotGreen: {
    backgroundColor: '#d9fdd3'
  },
  lotWhite: {
    backgroundColor: '#fff'
  }
};

export default Statistiques;
