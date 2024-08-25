import { Button, TextField } from '@mui/material';
import axios from 'axios';
import AutoComplement from 'Control/AutoComplet';
import { CreateContexteGlobal } from 'GlobalContext';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue } from 'static/Lien';

function AffectTech({ clients }) {
  const agent = useSelector((state) => state.agent?.agent.filter((x) => x.shop[0]?.shop === clients?.shop && x.fonction === 'tech'));
  const [agentSelect, setAgentSelect] = React.useState('');
  const [numSynchro, setNum] = React.useState('');
  const { setClient, client } = React.useContext(CreateContexteGlobal);

  const affecterTech = async (e) => {
    e.preventDefault();
    try {
      const data = {
        num_ticket: clients?.idPlainte,
        codeAgent: agentSelect?.codeAgent,
        numSynchro
      };
      const response = await axios.post(lien_issue + '/assign_tech_ticket', data, config);

      if (response.status === 200) {
        setClient(client.map((x) => (x._id === response.data._id ? response.data : x)));
        setAgentSelect('');
        setNum('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ width: '20rem' }}>
      <div style={{ marginTop: '10px' }}>
        {agent && <AutoComplement value={agentSelect} setValue={setAgentSelect} options={agent} title="Technicien" propr="nom" />}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          onChange={(e) => setNum(e.target.value)}
          style={{ marginTop: '10px' }}
          name="numSynchro"
          autoComplete="off"
          fullWidth
          value={numSynchro}
          label="Numero synchro"
        />
      </div>
      <div>
        <Button onClick={(e) => affecterTech(e)} fullWidth color="primary" variant="contained">
          Valider
        </Button>
      </div>
    </div>
  );
}
AffectTech.propTypes = {
  clients: PropTypes.object
};
export default AffectTech;
