import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import AutoComplement from 'Control/AutoComplet';
import { CreateContexteGlobal } from 'GlobalContext';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_issue } from 'static/Lien';

function AffectTech({ clients }) {
  const agent = useSelector((state) =>
    state.agent?.agent.filter((x) => x.shop[0]?.shop === clients?.shop && x.fonction === 'tech' && x.active === true)
  );
  const [agentSelect, setAgentSelect] = React.useState('');
  const [numSynchro, setNum] = React.useState('');
  const { client, setClient } = React.useContext(CreateContexteGlobal);

  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    messageApi.open({
      type,
      content: '' + texte,
      duration: 5
    });
  };

  const affecterTech = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${lien_issue}/assign_tech_ticket`,
        {
          num_ticket: clients?.idPlainte,
          codeAgent: agentSelect?.codeAgent,
          numSynchro
        },
        config
      );
      if (response.status === 200) {
        success('Technician assigned', 'success');
        setAgentSelect('');
        setNum('');
        setClient(client.map((x) => (x._id === response.data._id ? response.data : x)));
      }
      if (response.status === 201) {
        success('Assignment error', 'error');
      }
    } catch (error) {
      success('' + error, 'success');
    }
  };

  return (
    <div style={{ width: '20rem' }}>
      {contextHolder}
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
export default React.memo(AffectTech);
