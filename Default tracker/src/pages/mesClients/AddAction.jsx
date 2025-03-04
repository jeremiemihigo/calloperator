import { Button, TextField } from '@mui/material';
import { message } from 'antd';
import axios from 'axios';
import AutoComplement from 'components/AutoComplete';
import SimpleBackdrop from 'components/Backdrop';
import Selected from 'components/Select';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_dt } from 'static/Lien';

function AddAction({ data, fetchData, type }) {
  const { codeclient, region, shop } = data;
  const agents = useSelector((state) => state.agent.agent);
  const [agent, setAgent] = React.useState('');

  const [valueSelect, setValueSelect] = React.useState('');
  const [commentaire, setComment] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const selection = [
    { id: 1, title: 'Repossession', value: 'Repossession' },
    { id: 2, title: 'Reactivation', value: 'Reactivation' },
    { id: 3, title: 'Opt-out', value: 'Opt-out' }
  ];
  const dataDecision = [
    { id: 1, title: 'Write_off', value: 'Write_off' },
    { id: 2, title: 'Opt_out', value: 'Opt_out' }
  ];
  const [messageApi, contextHolder] = message.useMessage();
  const success = (texte, type) => {
    navigator.clipboard.writeText(texte);
    messageApi.open({
      type: '' + type,
      content: '' + texte,
      duration: 2
    });
  };
  const sendAction = async () => {
    try {
      setSending(true);
      let dataAction = {
        codeclient,
        region,
        shop,
        action: valueSelect,
        codeAgent: agent?.codeAgent,
        commentaire
      };
      let dataDecision = { codeclient, commentaire, shop, region, decision: valueSelect };
      let link = type === 'decision' ? '/adddecision' : '/oneaction';
      let donner = type === 'decision' ? dataDecision : dataAction;
      const response = await axios.post(lien_dt + link, donner, config);

      if (response.status === 200) {
        success('Done ' + codeclient, 'success');
        setSending(false);
        setValueSelect('');
        setComment('');
        setAgent('');
        fetchData();
      } else {
        success('' + JSON.stringify(response.data), 'warning');
        setSending(false);
      }
    } catch (error) {
      success('' + JSON.stringify(error.message), 'warning');
      setSending(false);
    }
  };
  return (
    <div style={{ minWidth: '20rem', padding: '10px' }}>
      {contextHolder}
      <SimpleBackdrop open={sending} title="Please wait..." taille="10rem" />
      <div>
        <Selected label="Type" data={type === 'decision' ? dataDecision : selection} value={valueSelect} setValue={setValueSelect} />
      </div>
      <div style={{ margin: '10px 0px' }}>
        <TextField onChange={(e) => setComment(e.target.value)} value={commentaire} fullWidth label="Commentaire" id="Commentaire" />
      </div>
      {agents && (
        <div style={{ marginBottom: '10px' }}>
          <AutoComplement value={agent} setValue={setAgent} options={agents} title="Agent" propr="nom" />
        </div>
      )}
      <div>
        <Button onClick={() => sendAction()} fullWidth color="primary" variant="contained">
          Valider
        </Button>
      </div>
    </div>
  );
}

export default AddAction;
