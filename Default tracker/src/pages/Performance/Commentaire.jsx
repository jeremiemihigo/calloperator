import { Send } from '@mui/icons-material';
import { Autocomplete, Stack, TextField } from '@mui/material';
import DirectionSnackbar from 'components/Direction';
import React from 'react';
import { useSelector } from 'react-redux';
import { config, lien_dt } from 'static/Lien';
import axios from '../../../node_modules/axios/index';
import { CreateContextePerformance } from './Context';
import { table_keys } from './template';

function Commentaire() {
  const [comment, setComment] = React.useState('');
  const { dossierSelect, concerne } = React.useContext(CreateContextePerformance);
  const agents = useSelector((state) => state.agent.agent);
  const [agentSelect, setAgentSelect] = React.useState([]);
  const [key, setKey] = React.useState([]);
  const [file, setFile] = React.useState('');
  const [state, setState] = React.useState({ send: false, message: '' });
  const sendCommentaire = async (event) => {
    try {
      event.preventDefault();
      setState({ send: true, message: '' });
      const formData = new FormData();
      formData.append('message', comment);
      formData.append('last_message', concerne ? concerne?.id : '');
      formData.append(
        'agents',
        agentSelect.map((index) => {
          return index.codeAgent;
        })
      );
      formData.append('column', key);
      formData.append('id', dossierSelect?.id);
      formData.append('file', file);

      const response = await axios.post(`${lien_dt}/add_commentaire`, formData, config);
      if (response.status === 200) {
        setState({ send: false, message: 'Done' });
      } else {
        setState({ send: false, message: response.data });
      }
    } catch (error) {
      setState({ send: false, message: error.message });
    }
  };
  return (
    <div>
      {state.message && <DirectionSnackbar message={state.message} />}
      <TextField
        name="Commentaire"
        label="Commentaire"
        onChange={(event) => setComment(event.target.value)}
        value={comment}
        id="commentaire"
        variant="outlined"
        fullWidth
        multiline
        sx={{
          mt: 2,
          mb: 2
        }}
      />
      {agents && agents.length > 0 && (
        <Stack spacing={3} sx={{ width: '100%', margin: '10px 0px' }}>
          <Autocomplete
            multiple
            value={agentSelect}
            id="tags-outlined"
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setAgentSelect({
                  title: newValue
                });
              } else if (newValue && newValue.inputValue) {
                // Create a new value from the user input
                setAgentSelect({
                  title: newValue.inputValue
                });
              } else {
                setAgentSelect(newValue);
              }
            }}
            options={agents}
            getOptionLabel={(option) => option.nom}
            filterSelectedOptions
            renderInput={(params) => <TextField {...params} label="Agent" placeholder="Agents" />}
          />
        </Stack>
      )}

      <Stack spacing={3} sx={{ width: '100%', margin: '10px 0px' }}>
        <Autocomplete
          multiple
          value={key}
          id="tags-outlined"
          onChange={(event, newValue) => {
            if (typeof newValue === 'string') {
              setKey({
                title: newValue
              });
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setKey({
                title: newValue.inputValue
              });
            } else {
              setKey(newValue);
            }
          }}
          options={table_keys}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          renderInput={(params) => <TextField {...params} label="Column" placeholder="Column" />}
        />
      </Stack>
      {dossierSelect && (
        <div className="formbtn">
          <input
            type="file"
            onChange={(event) => {
              const file = event.target.files[0];
              setFile(file);
            }}
          />
          <button disabled={state.send} onClick={(event) => sendCommentaire(event)}>
            <Send />
          </button>
        </div>
      )}
    </div>
  );
}

export default Commentaire;
